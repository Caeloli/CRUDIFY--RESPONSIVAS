const {
  countResponsiveFilesStatus,
  insertResponsiveFile,
  deleteResponsiveFile,
  getResponsiveFile,
  getAllResponsiveFiles,
  updateResponsiveFile,
} = require("../../controller/responsiveFileController");
const { insertUser, deleteUser } = require("../../controller/usersController");
const db = require("../../config/database/sequelize");

describe("Responsive File Handling", () => {
  let testUserId;
  let testResponsiveId;

  beforeAll(async () => {
    try {
      await db.sequelize.authenticate();
      const userData = {
        email: "test@example.com",
        user_type_id_fk: 1,
      };
      const newUser = await insertUser(userData);
      testUserId = newUser.user_id;
    } catch (error) {
      console.error("Error setting up beforeAll:", error);
    }
  });

  afterAll(async () => {
    // Close the database connection after running tests
    /*
    try {
      await waitForUserTestID();
      await deleteUser(testUserId);
      await db.sequelize.close();
    } catch (error) {
      console.error("Error tearing down afterAll:", error);
    }
    */
  });

  const waitForUserTestID = () => {
    return new Promise((resolve) => {
      const checkUser = () => {
        if (testUserId !== null) {
          resolve();
        } else {
          setTimeout(checkUser, 100);
        }
      };
      checkUser();
    });
  };

  const waitForResponsiveTestId = () => {
    return new Promise((resolve) => {
      const checkId = () => {
        if (testResponsiveId !== null) {
          resolve();
        } else {
          setTimeout(checkId, 100); // Check again after a short delay
        }
      };

      checkId();
    });
  };

  it("should insert a responsive file", async () => {
    await waitForUserTestID();
    const responsiveFileData = {
      remedy: "Test Remedy",
      user_id_fk: testUserId,
      token: "Test Token",
      user_name: "Test User",
      email: "test@example.com",
      phone: "123-456-7890",
      immediately_chief: "Test Chief",
      windows_server: "Test Server",
      domain: "Test Domain",
      account: "Test Account",
      start_date: new Date(), // Use the current date as the start date
      end_date: new Date(), // Use the current date as the end date
      file_format: 3,
      file_route: "/path/to/file.txt",
      // ... additional fields
    };

    const newResponsiveFile = await insertResponsiveFile(responsiveFileData);
    expect(newResponsiveFile).toHaveProperty("resp_id");
    testResponsiveId = newResponsiveFile.resp_id;
  });

  it("should update the responsive file", async () => {
    await waitForResponsiveTestId();
    const responsiveFileData = {
      remedy: "Update Remedy",
      user_id_fk: testUserId,
      token: "Update Token",
      user_name: "Update User",
      email: "update@example.com",
      phone: "7890-456-123",
      immediately_chief: "Update Chief",
      windows_server: "Update Server",
      domain: "Update Domain",
      account: "Update Account",
      start_date: new Date(), // Use the current date as the start date
      end_date: new Date(), // Use the current date as the end date
      file_format: 3,
      file_route: "/path/to/file.txt",
      // ... additional fields
    };

    const updatedResponsiveFile = await updateResponsiveFile(
      testResponsiveId,
      responsiveFileData
    );
    expect(updatedResponsiveFile.remedy).toBe(responsiveFileData.remedy);
  });

  it("should retrieve all responsive files", async () => {
    await waitForResponsiveTestId();
    const responsiveFiles = await getAllResponsiveFiles();
    expect(responsiveFiles).toBeInstanceOf(Array);
  });

  it("should retrieve a responsive file with specific id", async () => {
    await waitForResponsiveTestId();
    const responsiveFile = await getResponsiveFile(testResponsiveId);

    expect(responsiveFile).not.toBeNull();
    expect(responsiveFile.resp_id).toBe(testResponsiveId);
  });

  it("should delete the responsive file", async () => {
    await waitForResponsiveTestId();
    const result = await deleteResponsiveFile(testResponsiveId);
    expect(result).toBe(true);

    // Verify that the user has been deleted
    const deletedFile = await getResponsiveFile(testResponsiveId);
    expect(deletedFile).toBeNull();
  });
  
});

/*describe("countResponsiveFilesStatus", () => {
  it("should retrieve and log the count of responsive files", async () => {
    jest.spyOn(db.responsiveFiles, "findAll").mockResolvedValueOnce([
      {
        // dynamically generated data //
      },
    ]);

    const results = await countResponsiveFilesStatus();
  });
  it("should handle errors", async () => {
    // Assert that the function returns an error
    jest
      .spyOn(db.responsiveFiles, "findAll")
      .mockRejectedValueOnce(new Error("Mocked error"));

    const error = await countResponsiveFilesStatus();

    // Your error handling test assertions here
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Mocked error");
  });
});
*/
