const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
// eslint-disable-next-line no-unused-vars
const { response } = require("../app");

let server, agent;

function extractCsrfToken(res){
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Sport Scheduler Application", function () {
    beforeAll(async () => {
      await db.sequelize.sync({ force: true });
      server = app.listen(10000, () => {});
      agent = request.agent(server);
    });
    afterAll(async () => {
        try {
          await db.sequelize.close();
          await server.close();
        } catch (error) {
          console.log(error);
        }
      });
    //   test("Creates a new Sport", async () => {
    //     const agent = request.agent(server);
    //     await login(agent, "nehath@admin.com", "nehath");
    //     let res = await agent.get("/createSport");
    //     let csrfToken = extractCsrfToken(res);
    //     const response = await agent.post("/admin/createSport").send({
    //       SportName: "Buy milk",
    //       "_csrf": csrfToken,
    //     });
    //     expect(response.statusCode).toBe(302);
    //   });
})