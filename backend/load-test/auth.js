const axios = require("axios");

module.exports = {
  async beforeRequest(req, context, ee, next) {
    if (!context.vars.token) {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: context.vars.email,
        password: context.vars.password,
      });
      context.vars.token = response.data.access_token;
    }
    req.headers["Authorization"] = `Bearer ${context.vars.token}`;
    return next();
  },
};
