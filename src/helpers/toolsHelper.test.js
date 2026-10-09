import Swal from "sweetalert2";
import {
  countdownText, formatDate, formatRupiah, getHighestBid, isAucationClosed, showConfirmDialog,
  showErrorDialog, showSuccessDialog, showWarningDialog, toApiDate,
} from "./toolsHelper.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

describe("toolsHelper", () => {
  it("dialog", async () => {
    await showSuccessDialog("ok");
    await showErrorDialog("err");
    await showWarningDialog("warn");
    expect(Swal.fire).toHaveBeenCalledTimes(3);
    expect(await showConfirmDialog("yakin?")).toBe(true);
  });
  it("format", () => {
    expect(formatRupiah(1000)).toContain("1.000");
    expect(formatRupiah("x")).toContain("0");
    expect(formatDate(null)).toBe("-");
    expect(formatDate("2026-01-01T10:00:00")).toContain("2026");
    expect(toApiDate("2026-10-10T10:00")).toBe("2026-10-10 10:00:00");
    expect(toApiDate("")).toBe("");
  });
  it("getHighestBid", () => {
    expect(getHighestBid({ start_bid: 100, bids: [{ bid: 300 }, { bid: 200 }, {}] })).toBe(300);
    expect(getHighestBid({ start_bid: 100 })).toBe(100);
    expect(getHighestBid()).toBe(0);
  });
  it("isAucationClosed & countdownText", () => {
    const now = new Date("2026-10-10T00:00:00").getTime();
    expect(isAucationClosed({ is_closed: 1 })).toBe(true);
    expect(isAucationClosed({ closed_at: "2026-10-09T00:00:00" }, now)).toBe(true);
    expect(isAucationClosed({ closed_at: "2026-10-11T00:00:00" }, now)).toBe(false);
    expect(isAucationClosed({})).toBe(false);
    expect(isAucationClosed(null)).toBe(false);
    expect(countdownText(null)).toBe("Ditutup");
    expect(countdownText("2026-10-12T05:00:00", now)).toContain("2 hari");
    expect(countdownText("2026-10-10T05:30:00", now)).toBe("5 jam 30 menit lagi");
  });
});
