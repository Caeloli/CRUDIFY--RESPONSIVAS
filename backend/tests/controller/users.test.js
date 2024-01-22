const {
  insertUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
} = require("../../controller/usersController");
const db = require("../../config/database/sequelize");
describe("Users Handling", () => {
  let testUserId;

  const waitForTestId = () => {
    return new Promise((resolve) => {
      const checkId = () => {
        if (testUserId !== null) {
          resolve();
        } else {
          setTimeout(checkId, 100); // Check again after a short delay
        }
      };

      checkId();
    });
  };

  beforeAll(async () => {
    // Ensure the database is connected before running tests
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
    // Close the database connection after running tests
    await db.sequelize.close();
  });

  it("should insert a user", async () => {
    const userData = {
      email: "test@example.com",
      user_type_id_fk: 1,
    };
    const newUser = await insertUser(userData);
    expect(newUser).toHaveProperty("user_id");
    testUserId = newUser.user_id;
  });

  it("should update the user", async () => {
    await waitForTestId();
    const updatedUserData = {
      email: "updated@example.com",
    };

    const updatedUser = await updateUser(testUserId, updatedUserData);
    expect(updatedUser.email).toBe(updatedUserData.email);
  });

  it("should retrieve all users", async () => {
    await waitForTestId();
    const users = await getAllUsers();
    expect(users).toBeInstanceOf(Array); // Assuming the previously inserted user has been deleted
  });

  it("shoud retrieve an user with specific id", async () => {
    await waitForTestId();
    const user = await getUser(testUserId);
    // Assert that the user exists (is not null)
    expect(user).not.toBeNull();

    // Assert that the user has the correct id
    expect(user.user_id).toBe(testUserId);
  });

  it("should delete the user", async () => {
    await waitForTestId();
    const result = await deleteUser(testUserId);
    expect(result).toBe(true);

    // Verify that the user has been deleted
    const deletedUser = await getUser(testUserId);
    expect(deletedUser).toBeNull();
  });
});
