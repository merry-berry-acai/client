import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { makeRequest, clearCache, API_CONFIG } from "./apiHandler";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer(
  rest.get(`${API_CONFIG.baseURL}/items/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, name: "Acai Bowl" }]));
  }),

  rest.post(`${API_CONFIG.baseURL}/items/`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 2, name: req.body.name }));
  }),

  rest.put(`${API_CONFIG.baseURL}/items/:id`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: req.params.id, ...req.body }));
  }),

  rest.delete(`${API_CONFIG.baseURL}/items/:id`, (req, res, ctx) => {
    return res(ctx.status(204), ctx.json(null));
  }),

  rest.get(`${API_CONFIG.baseURL}/fail`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: "Server Error" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  clearCache();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("makeRequest API Utility", () => {
  it("should fetch menu items successfully", async () => {
    const data = await makeRequest({
      method: "get",
      endpoint: "/items/",
      cacheKey: "menuItems",
    });

    expect(data).toEqual([{ id: 1, name: "Acai Bowl" }]);
  });

  it("should use cache for GET requests", async () => {
    await makeRequest({
      method: "get",
      endpoint: "/items/",
      cacheKey: "menuItems",
    });

    server.use(
      rest.get(`${API_CONFIG.baseURL}/items/`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const data = await makeRequest({
      method: "get",
      endpoint: "/items/",
      cacheKey: "menuItems",
    });
    expect(data).toEqual([{ id: 1, name: "Acai Bowl" }]);
  });

  it("should create a new menu item", async () => {
    const newItem = { name: "Berry Smoothie" };
    const data = await makeRequest({
      method: "post",
      endpoint: "/items/",
      data: newItem,
    });

    expect(data).toEqual({ id: 2, name: "Berry Smoothie" });
  });

  it("should update a menu item", async () => {
    const updatedItem = { name: "Updated Acai Bowl" };
    const data = await makeRequest({
      method: "put",
      endpoint: "/items/1",
      data: updatedItem,
    });

    expect(data).toEqual({ id: "1", name: "Updated Acai Bowl" });
  });

  it("should delete a menu item", async () => {
    const result = await makeRequest({
      method: "delete",
      endpoint: "/items/1",
    });

    expect(result).toBe(null);
  });

  it("should retry failed requests up to configured retries", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn");

    server.use(
      rest.get(`${API_CONFIG.baseURL}/fail`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server Error" }));
      })
    );

    await expect(
      makeRequest({ method: "get", endpoint: "/fail" })
    ).rejects.toThrow();

    expect(consoleWarnSpy.mock.calls.length).toBe(API_CONFIG.retries);

    consoleWarnSpy.mockRestore();
  });

  it("should not retry on 4xx client errors", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn");

    server.use(
      rest.get(`${API_CONFIG.baseURL}/fail`, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: "Bad Request" }));
      })
    );

    await expect(
      makeRequest({ method: "get", endpoint: "/fail" })
    ).rejects.toThrow();

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});
