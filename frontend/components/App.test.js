import React from "react";
import AppFunctional from "./AppFunctional";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
let msgValue;

beforeEach(() => {
  render(<AppFunctional />);
  msgValue = screen.getByTestId("message");
});

test("hata olmadan render ediliyor", () => {
  render(<AppFunctional />);
});

test("click submit see email value", async () => {
  const inputEmail = screen.getByTestId("input-test");
  const btn = screen.getByTestId("submit-btn");

  fireEvent.change(inputEmail, { target: { value: "keremkaraman@gmail.com" } });

  fireEvent.click(btn);

  await waitFor(() => {
    expect(msgValue).toHaveTextContent("keremkaraman");
  });
});

test("post data without email see error msg", async () => {
  const btn = screen.getByTestId("submit-btn");

  fireEvent.click(btn);

  await waitFor(() => {
    expect(msgValue).toHaveTextContent("Ouch: email is required");
  });
});

test("you can't go up anymore err message", async () => {
  const upBtn = screen.getByTestId("up-btn-test");

  fireEvent.click(upBtn);
  fireEvent.click(upBtn);

  await waitFor(() => {
    expect(msgValue).toHaveTextContent("You can't go up");
  });
});

test("you can't go left anymore err message", async () => {
  const leftBtn = screen.getByTestId("left-bnt-test");

  fireEvent.click(leftBtn);
  fireEvent.click(leftBtn);
  fireEvent.click(leftBtn);

  await waitFor(() => {
    expect(msgValue).toHaveTextContent("You can't go left");
  });
});

test("get coordinates 1", async () => {
  const leftBtn = screen.getByTestId("left-bnt-test");
  const upBtn = screen.getByTestId("up-btn-test");
  const coordValue = screen.getByTestId("coord-test");

  fireEvent.click(leftBtn);
  fireEvent.click(upBtn);

  await waitFor(() => {
    expect(coordValue).toHaveTextContent("Koordinatlar (1, 1)");
  });
});
test("get coordinates correct 2", async () => {
  const rightBtn = screen.getByTestId("rgt-btn-test");
  const bottomBtn = screen.getByTestId("bottom-btn-test");
  const coordValue = screen.getByTestId("coord-test");

  fireEvent.click(rightBtn);
  fireEvent.click(bottomBtn);

  await waitFor(() => {
    expect(coordValue).toHaveTextContent("Koordinatlar (3, 3)");
  });
});
