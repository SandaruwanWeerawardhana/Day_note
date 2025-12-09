import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../components/TaskCard";

describe("TaskCard", () => {
  it("shows title and description", () => {
    const task = {
      id: 10,
      title: "Learn Testing",
      description: "Write unit tests for components",
      completed: false,
    };

    render(<TaskCard task={task} onComplete={() => {}} />);

    expect(screen.getByText("Learn Testing")).toBeInTheDocument();
    expect(
      screen.getByText("Write unit tests for components")
    ).toBeInTheDocument();
  });

  it("runs callback when Done button clicked", () => {
    const task = {
      id: 5,
      title: "Demo Task",
      description: "Sample description",
      completed: false,
    };

    const mockComplete = vi.fn();

    render(<TaskCard task={task} onComplete={mockComplete} />);

    fireEvent.click(screen.getByText("Done"));

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledWith(5);
  });
});
