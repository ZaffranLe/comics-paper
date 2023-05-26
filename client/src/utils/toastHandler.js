const { toast } = require("react-toastify");

/**
 *
 * @param {Promise} promise
 */
async function toastHandler(promise) {
  try {
    await promise;
  } catch (e) {
    toast.error(e.response?.data?.error?.message || "");
    console.error(e);
  }
}
module.exports = toastHandler;
