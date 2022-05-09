const hapi = require("@hapi/hapi");
const Schmervice = require("@hapipal/schmervice");

const server = new hapi.Server({
  port: 6969,
  host: "localhost",
});

server.route([
  {
    method: "GET",
    path: "/{x}/{y}",
    handler: async (request, h) => {
      const { x, y } = request.params;
      const { mathService } = request.services();

      return h.response({ answer: mathService.multiply(x, y) });
    },
  },
]);

//and here we are starting the server
const launch = async () => {
  await server.register(Schmervice);
  try {
    await server.start();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  console.log("server is running at port", server.info.uri);
};

launch();

server.registerService(
  class MathService extends Schmervice.Service {
    add(x, y) {
      this.server.log(["math-service"], "Adding");
      return Number(x) + Number(y);
    }

    multiply(x, y) {
      this.server.log(["math-service"], "Multiplying");
      return Number(x) * Number(y);
    }
  }
);
