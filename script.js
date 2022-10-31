const INCLUDE_TODAY = false;

document.addEventListener("DOMContentLoaded", () => {
  const stat = document.querySelector("#search-result > .row");
  stat.className += " show";

  const tr = document.querySelectorAll(
    ".table.jbc-table.text-center.jbc-table-bordered.jbc-table-hover > tbody > tr"
  );

  const workTimes = [];
  for (const content of tr) {
    workTimes.push({
      time:
        content.cells[5].textContent.length !== 0
          ? parseWorkTimeToMinites(content.cells[5].textContent)
          : null,
      isWorkDay: content.cells[1].textContent.length === 0,
      isWorking: content.cells[4].textContent === "(勤務中)",
    });
  }

  const allWorkedDays = workTimes.filter(
    (w) => w.isWorkDay && w.time != null && (INCLUDE_TODAY || !w.isWorking)
  ).length;
  const workTime = workTimes
    .filter(
      (w) => w.isWorkDay && w.time != null && (INCLUDE_TODAY || !w.isWorking)
    )
    .reduce((prev, curr) => curr.time + prev, 0);
  const y = workTime - allWorkedDays * 8 * 60;

  let diffText = minutesToStr(y);
  if (diffText.match(/^-/)) {
    diffText = `<span style="color: red;">${diffText}</span>`;
  }

  const info = document.createElement("div");
  info.className = "col-lg-6 mb-3";
  info.innerHTML = `
  <div class="card jbc-card-bordered h-100">
    <div class="card-header jbc-card-header">
      <h5 class="card-text">
        便利な統計
      <h5>
    </div>
    <div class="card-body">
      <table class="table jbc-table jbc-table-fixed">
        <tr>
          <th scope="row" class="jbc-text-sub text-nowrap">
            1日8時間働いていた場合の<br />
            労働時間
          </th>
          <td>
             ${minutesToStr(allWorkedDays * 8 * 60)}
          </td>
        </tr>
        <tr>
          <th scope="row" class="jbc-text-sub text-nowrap">
            実労働時間との差分
          </th>
          <td>
            ${diffText}
          </td>
        </tr>
      </table>
    </div>
  </div>
`;
  stat.insertBefore(info, stat.firstChild);
});

function parseWorkTimeToMinites(str) {
  const matches = str.match(/^(\d\d):(\d\d)$/);
  const h = parseInt(matches[1]);
  const m = parseInt(matches[2]);
  return h * 60 + m;
}

function sign(num) {
  if (num < 0) {
    return "-";
  }
  return "";
}

function minutesToStr(min) {
  const hAbs = Math.floor(Math.abs(min) / 60);
  const m = Math.floor(Math.abs(min)) % 60;

  return `${sign(min)}${hAbs}:${("00" + m.toString()).substr(-2)}`;
}
