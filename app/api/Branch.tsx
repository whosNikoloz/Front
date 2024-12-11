const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const Branchs = () => {
  const GetBranch = async () => {
    try {
      const apiUrl = serverUrl;
      const response = await fetch(apiUrl + "branches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          return { status: true, result: data.result };
        } else {
          return { status: false, result: data.result };
        }
      } else {
        const errorText = await response.text();
        return { status: false, result: errorText };
      }
    } catch (error) {
      return { status: false, result: error };
    }
  };

  const handleRemoveBranch = async (BranchId: number) => {
    try {
      const response = await fetch(serverUrl + "branches/" + BranchId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          return { status: true, result: data.result };
        }
        return { status: false, result: data.result };
      } else {
        const errorText = await response.text();
        return { status: false, result: errorText };
      }
    } catch (error) {
      return { status: false, result: error };
    }
  };

  const handleUpdateBranch = async (BranchId: number, data: any) => {
    try {
      const response = await fetch(serverUrl + "branches/" + BranchId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        const errorText = await response.text();
        return { status: false, result: errorText };
      }
    } catch (error) {
      return { status: false, error };
    }
  };

  const handleAddBranch = async (BranchData: any) => {
    try {
      const response = await fetch(serverUrl + "branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(BranchData), // Convert data to JSON
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status) {
          return { status: true, result: responseData.result };
        } else {
          return {
            status: false,
            result: responseData.result,
          };
        }
      } else {
        const errorText = await response.json();
        return { status: false, result: errorText.result }; // Return the error details
      }
    } catch (error) {
      console.error("Error while adding Branch:", error);
      return { success: false, error }; // Return error if fetch fails
    }
  };

  return {
    handleUpdateBranch,
    handleAddBranch,
    handleRemoveBranch,
    GetBranch,
  };
};

export default Branchs;
