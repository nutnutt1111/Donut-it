(function () {
  const STORAGE_KEY = "donut-salary-draft";

  const LINE_ITEMS = [
    {
      id: "ot",
      label: "OT",
      type: "rateQty",
      unit: "ชั่วโมง",
      defaultRate: 40,
      defaultQty: 0,
      isDeduction: false,
    },
    {
      id: "commission",
      label: "ค่าคอม",
      type: "rateQty",
      unit: "ชิ้น",
      defaultRate: 100,
      defaultQty: 0,
      isDeduction: false,
    },
    {
      id: "pawnCommission",
      label: "ค่าคอมจำนำ",
      type: "rateQty",
      unit: "หน่วยพัน",
      note: "บาท ต่อ 1,000",
      defaultRate: 40,
      defaultQty: 0,
      isDeduction: false,
    },
    {
      id: "installment",
      label: "หักค่าผ่อน",
      type: "flat",
      unit: "",
      defaultAmount: 0,
      isDeduction: true,
    },
    {
      id: "shipping",
      label: "ค่าส่ง",
      type: "flat",
      unit: "",
      defaultAmount: 0,
      isDeduction: false,
    },
    {
      id: "phoneFood",
      label: "ค่าโทรศัพท์-กิน",
      type: "flat",
      unit: "",
      defaultAmount: 0,
      isDeduction: false,
    },
    {
      id: "otherDeduction",
      label: "หักอื่นๆ",
      type: "flat",
      unit: "",
      defaultAmount: 0,
      isDeduction: true,
    },
  ];

  function formatBaht(amount) {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function parseNumber(value) {
    const parsed = parseFloat(String(value).replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function calcLineAmount(item, rate, qty, flatAmount) {
    if (item.type === "rateQty") {
      return rate * qty;
    }
    return flatAmount;
  }

  function getFormValues(form) {
    const employeeName = form.querySelector('[name="employeeName"]').value.trim();
    const paidNote = form.querySelector('[name="paidNote"]').value.trim();
    const lines = LINE_ITEMS.map((item) => {
      const rate = parseNumber(
        form.querySelector(`[name="${item.id}-rate"]`)?.value
      );
      const qty = parseNumber(
        form.querySelector(`[name="${item.id}-qty"]`)?.value
      );
      const amount = parseNumber(
        form.querySelector(`[name="${item.id}-amount"]`)?.value
      );
      const lineAmount = calcLineAmount(item, rate, qty, amount);
      const signedAmount = item.isDeduction ? -lineAmount : lineAmount;

      return {
        ...item,
        rate,
        qty,
        amount: lineAmount,
        signedAmount,
      };
    });

    const total = lines.reduce((sum, line) => sum + line.signedAmount, 0);

    return { employeeName, paidNote, lines, total };
  }

  function updateSubtotals(form) {
    const data = getFormValues(form);

    data.lines.forEach((line) => {
      const subtotalEl = form.querySelector(`[data-subtotal="${line.id}"]`);
      if (subtotalEl) {
        const prefix = line.isDeduction && line.amount > 0 ? "-" : "";
        subtotalEl.textContent = prefix + formatBaht(line.amount);
        subtotalEl.classList.toggle("is-deduction", line.isDeduction && line.amount > 0);
      }
    });

    const totalEl = form.querySelector('[data-total="grand"]');
    if (totalEl) {
      totalEl.textContent = formatBaht(data.total) + " บาท";
      totalEl.classList.toggle("is-negative", data.total < 0);
    }

    return data;
  }

  function saveDraft(form) {
    const data = getFormValues(form);
    const draft = {
      employeeName: data.employeeName,
      paidNote: data.paidNote,
      values: {},
    };

    LINE_ITEMS.forEach((item) => {
      if (item.type === "flat") {
        draft.values[`${item.id}-amount`] =
          form.querySelector(`[name="${item.id}-amount"]`)?.value ?? "";
      } else {
        draft.values[`${item.id}-rate`] =
          form.querySelector(`[name="${item.id}-rate"]`)?.value ?? "";
        draft.values[`${item.id}-qty`] =
          form.querySelector(`[name="${item.id}-qty"]`)?.value ?? "";
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function loadDraft(form) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      form.querySelector('[name="employeeName"]').value =
        draft.employeeName ?? "";
      form.querySelector('[name="paidNote"]').value = draft.paidNote ?? "";

      Object.entries(draft.values ?? {}).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) input.value = value;
      });
    } catch (_error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function resetForm(form) {
    form.reset();
    LINE_ITEMS.forEach((item) => {
      if (item.type === "flat") {
        const amountInput = form.querySelector(`[name="${item.id}-amount"]`);
        if (amountInput) amountInput.value = item.defaultAmount ?? 0;
      } else {
        const rateInput = form.querySelector(`[name="${item.id}-rate"]`);
        const qtyInput = form.querySelector(`[name="${item.id}-qty"]`);
        if (rateInput) rateInput.value = item.defaultRate ?? 0;
        if (qtyInput) qtyInput.value = item.defaultQty ?? 0;
      }
    });
    localStorage.removeItem(STORAGE_KEY);
    updateSubtotals(form);
  }

  function buildSummaryText(data) {
    const lines = [
      `เงินเดือน: ${data.employeeName || "-"}`,
      "ทำงาน/เดือน",
      "",
    ];

    data.lines.forEach((line) => {
      if (line.amount <= 0) return;

      if (line.type === "rateQty") {
        lines.push(
          `${line.label}: ${formatBaht(line.rate)} x ${formatBaht(line.qty)} = ${line.isDeduction ? "-" : ""}${formatBaht(line.amount)}${line.unit ? " " + line.unit : ""}`
        );
      } else {
        lines.push(
          `${line.label}: ${line.isDeduction ? "-" : ""}${formatBaht(line.amount)}`
        );
      }
    });

    lines.push("", `รวม: ${formatBaht(data.total)} บาท`);

    if (data.paidNote) {
      lines.push(`ชำระแล้ว: ${data.paidNote}`);
    }

    return lines.join("\n");
  }

  function renderSalaryForm(container) {
    container.innerHTML = `
      <form id="salary-form" class="salary-form" autocomplete="off">
        <div class="salary-meta">
          <label class="salary-field">
            <span>ชื่อพนักงาน</span>
            <input type="text" name="employeeName" placeholder="เช่น แยม" />
          </label>
          <label class="salary-field">
            <span>ชำระแล้ว / หมายเหตุ</span>
            <input type="text" name="paidNote" placeholder="เช่น โอนแล้ว 5 ก.ค." />
          </label>
        </div>

        <div class="salary-section-title">ทำงาน/เดือน</div>

        <div class="salary-table-wrap">
          <table class="salary-table" aria-label="ตารางคำนวณเงินเดือน">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>อัตรา/บาท</th>
                <th>จำนวน</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              ${LINE_ITEMS.map((item) => {
                if (item.type === "flat") {
                  return `
                    <tr class="${item.isDeduction ? "is-deduction-row" : ""}">
                      <td data-label="รายการ">
                        <span class="line-label">${item.label}</span>
                      </td>
                      <td data-label="อัตรา/บาท" class="muted">-</td>
                      <td data-label="จำนวน">
                        <input
                          type="number"
                          inputmode="decimal"
                          min="0"
                          step="any"
                          name="${item.id}-amount"
                          class="salary-input"
                          value="${item.defaultAmount ?? 0}"
                        />
                      </td>
                      <td data-label="รวม" class="subtotal" data-subtotal="${item.id}">0</td>
                    </tr>
                  `;
                }

                const qtyPlaceholder = item.unit || "จำนวน";

                return `
                  <tr class="${item.isDeduction ? "is-deduction-row" : ""}">
                    <td data-label="รายการ">
                      <span class="line-label">${item.label}</span>
                      ${
                        item.note
                          ? `<small class="line-note">${item.note}</small>`
                          : item.unit
                            ? `<small class="line-note">${item.unit}</small>`
                            : ""
                      }
                    </td>
                    <td data-label="อัตรา/บาท">
                      <input
                        type="number"
                        inputmode="decimal"
                        min="0"
                        step="any"
                        name="${item.id}-rate"
                        class="salary-input"
                        value="${item.defaultRate ?? 0}"
                      />
                    </td>
                    <td data-label="จำนวน">
                      <input
                        type="number"
                        inputmode="decimal"
                        min="0"
                        step="any"
                        name="${item.id}-qty"
                        class="salary-input"
                        placeholder="${qtyPlaceholder}"
                        value="${item.defaultQty ?? 0}"
                      />
                    </td>
                    <td data-label="รวม" class="subtotal" data-subtotal="${item.id}">0</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">รวม</td>
                <td class="total-value" data-total="grand">0 บาท</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="salary-actions">
          <button type="button" class="btn btn-secondary" data-action="reset">ล้างข้อมูล</button>
          <button type="button" class="btn btn-secondary" data-action="copy">คัดลอกสรุป</button>
        </div>

        <p class="salary-hint" data-copy-status hidden></p>
      </form>
    `;

    const form = container.querySelector("#salary-form");
    loadDraft(form);
    updateSubtotals(form);

    form.addEventListener("input", () => {
      updateSubtotals(form);
      saveDraft(form);
    });

    form.querySelector('[data-action="reset"]').addEventListener("click", () => {
      if (confirm("ล้างข้อมูลทั้งหมดในฟอร์มนี้?")) {
        resetForm(form);
      }
    });

    form.querySelector('[data-action="copy"]').addEventListener("click", async () => {
      const data = updateSubtotals(form);
      const text = buildSummaryText(data);
      const statusEl = form.querySelector("[data-copy-status]");

      try {
        await navigator.clipboard.writeText(text);
        statusEl.textContent = "คัดลอกสรุปเรียบร้อยแล้ว";
        statusEl.hidden = false;
        setTimeout(() => {
          statusEl.hidden = true;
        }, 2500);
      } catch (_error) {
        statusEl.textContent = "คัดลอกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        statusEl.hidden = false;
      }
    });
  }

  window.DonutSalary = {
    init: function (containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      renderSalaryForm(container);
    },
  };
})();
