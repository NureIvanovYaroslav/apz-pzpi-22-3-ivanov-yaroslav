const bcrypt = require("bcryptjs");
const RoleModel = require("../models/Role");
const UserModel = require("../models/User");
const tokenService = require("./TokenService");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../errors/apiError");

class AuthService {
  /**
   * Registers a new user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} - The registered user and tokens.
   */
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(`User with this email already exists`);
    }

    const hashPassword = bcrypt.hashSync(password, 7);

    const userRole = await RoleModel.findOne({ value: "USER" });

    const user = await UserModel.create({
      email,
      password: hashPassword,
      name: email.split("@")[0],
      birthDate: "2000-01-01",
      height: 180,
      weight: 75,
      country: "Ukraine",
      sex: "male",
      device: null,
      roles: [userRole.value],
      notifications: [],
      goals: [],
      userFitnessStudios: [],
    });

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  /**
   * Logs in a user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} - The tokens.
   */
  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("There are no users with this email");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      throw ApiError.BadRequest("Wrong password");
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Logs out a user.
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<Object>} - The removed token.
   */
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  /**
   * Refreshes the tokens.
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<Object>} - The new tokens.
   */
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError("User is not authorised");
    }

    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError("User is not authorised");
    }

    const user = await UserModel.findById(userData.id);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return tokens;
  }
}

module.exports = new AuthService();
