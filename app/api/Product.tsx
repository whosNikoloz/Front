import "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const Products = () => {
  const GetProducts = async (lang: string) => {
    try {
      const response = await fetch(serverUrl + `Products?lang=${lang}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const Products = await response.json();
        return Products;
      } else {
        const errorText = await response.text();
        console.error("Products Get:", errorText); // Log the error
        return errorText;
      }
    } catch (error) {
      console.error("Products Get error:", error); // Log the error
      return error;
    }
  };

  const GetProductsByLevelId = async (branchId: number) => {
    try {
      if (!serverUrl) {
        throw new Error("Server URL is not defined");
      }
      const response = await fetch(serverUrl + branchId + `/Product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const Products = await response.json();
        return Products;
      } else {
        const errorText = await response.text();
        console.error("Products Get:", errorText); // Log the error
        return errorText;
      }
    } catch (error) {
      console.error("Products Get error:", error); // Log the error
      return error;
    }
  };

  const handleUpdateProduct = async (ProductId: number, ProductData: any) => {
    try {
      const response = await fetch(serverUrl + "Products/" + ProductId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ProductData),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status) {
          return { status: true, result: responseData.result };
        } else {
          return {
            status: false,
            result: responseData.error,
          };
        }
      } else {
        const errorText = await response.text(); // Extract error details
        return { status: false, result: errorText }; // Return the error details
      }
    } catch (error) {
      console.error("Error while updating Product:", error);
      return { success: false, error }; // Return error if fetch fails
    }
  };

  const handleRemoveProduct = async (ProductId: number, logoPath: string) => {
    try {
      const response = await fetch(serverUrl + "Product/" + ProductId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        if (logoPath) {
          try {
            await deleteFileFromFirebaseStorage(logoPath);
          } catch (error) {
            console.error("Error deleting old picture:", error);
          }
        }
        const responseData = await response.json();

        if (responseData.status) {
          return { status: true, result: responseData.result };
        } else {
          return {
            status: false,
            result: responseData.error,
          };
        }
      } else {
        const errorText = await response.text(); // Extract error details
        return { status: false, result: errorText }; // Return the error details
      }
    } catch (error) {
      console.error("Error while deleting Product:", error);
      return { success: false, error }; // Return error if fetch fails
    }
  };

  const GetProduct = async (ProductName: string, lang: string) => {
    try {
      const response = await fetch(
        serverUrl + "Product/" + `${ProductName}?lang=${lang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the bearer token in the Authorization header
          },
        }
      );
      if (response.ok) {
        const Products = await response.json();
        return Products;
      } else {
        const errorText = await response.text();
        console.error("Products Get:", errorText); // Log the error
        return errorText;
      }
    } catch (error) {
      console.error("Products Get error:", error); // Log the error
      return error;
    }
  };

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const GetProductName = async (
    notFormattedProductName: string,
    lang: string
  ) => {
    try {
      const response = await fetch(
        `${serverUrl}Products/ProductName/${notFormattedProductName}?lang=${lang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include other headers if needed
          },
        }
      );

      if (response.ok) {
        const ProductName = await response.text();
        return ProductName;
      } else {
        const errorText = await response.text();
        console.error("Products Get:", errorText); // Log the error
        return errorText;
      }
    } catch (error) {
      console.error("Products Get error:", error); // Log the error
      return error;
    }
  };

  const ChangeProductLogo = async (
    picture: File,
    oldpicture: string,
    Productid: number,
    LevelName: string
  ) => {
    try {
      // Delete the old picture if it exists
      if (oldpicture) {
        try {
          await deleteFileFromFirebaseStorage(oldpicture);
        } catch (error) {
          console.error("Error deleting old picture:", error);
        }
      }

      // Create folder logic (Firebase will create it automatically when uploading)
      const folderPath = `Learn/Products/${LevelName}`;

      // Upload the new picture to the correct folder path
      const pictureUrl = picture
        ? await uploadFileToFirebaseStorage(picture, folderPath)
        : null;

      // Send the uploaded picture URL to the server
      const response = await fetch(serverUrl + "Product/UploadLogo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the bearer token in the Authorization header
        },
        body: JSON.stringify({
          Productid,
          pictureUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          return { status: true, result: pictureUrl };
        } else {
          return { status: false, result: data.result };
        }
      } else {
        return { status: false, result: "An unexpected error occurred" };
      }
    } catch (error) {
      return { status: false, result: error };
    }
  };

  const uploadFileToFirebaseStorage = async (
    file: File,
    folderName: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const uniqueFileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}-${file.name}`;
        const fileRef = ref(storage, `${folderName}/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can monitor the progress here if needed.
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error("Error uploading file:", error);
            reject(error);
          },
          async () => {
            try {
              // Upload completed statusly, get the download URL.
              const downloadURL = await getDownloadURL(fileRef);
              resolve(downloadURL);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          }
        );

        // Wait for the upload to complete.
        await uploadTask;
      } catch (error) {
        console.error("Error uploading file to Firebase Storage:", error);
        reject(error);
      }
    });
  };

  const deleteFileFromFirebaseStorage = async (fileUrl: string) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, fileUrl);

      // Check if the file exists
      const url = await getDownloadURL(fileRef);
      if (url) {
        // Delete the file
        await deleteObject(fileRef);
      }
    } catch (error) {
      if ((error as { code: string }).code === "storage/object-not-found") {
        // File doesn't exist
      } else {
        // Some other error occurred
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleAddProduct = async (LevelId: number, ProductData: any) => {
    try {
      if (!serverUrl) {
        throw new Error("Server URL is not defined");
      }

      const response = await fetch(serverUrl + LevelId + "/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ProductData),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status) {
          return { status: true, result: responseData.result };
        } else {
          return {
            status: false,
            result: responseData.error,
          };
        }
      } else {
        const errorText = await response.json();
        return { status: false, result: errorText.result }; // Return the error details
      }
    } catch (error) {
      console.error("Error while adding Product:", error);
      return { success: false, error }; // Return error if fetch fails
    }
  };

  return {
    GetProducts,
    GetProduct,
    GetProductName,
    GetProductsByLevelId,
    handleAddProduct,
    handleUpdateProduct,
    handleRemoveProduct,
    ChangeProductLogo,
  };
};

export default Products;
