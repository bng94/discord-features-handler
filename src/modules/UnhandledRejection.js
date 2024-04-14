module.exports = () => {
  process.on("unhandledRejection", (e) => {
    console.log(e);
  });
};
