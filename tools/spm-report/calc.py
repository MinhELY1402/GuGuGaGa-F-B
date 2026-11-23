"""Tính PERT/CPM (gốc + điều chỉnh), Gantt, PV theo tuần, kịch bản EVM tuần 6 và vẽ hình.
Chạy trong thư mục đầu ra:  python calc.py   → data.json + pert_original.png, pert_revised.png,
gantt.png, scurve.png, cpi_spi.png. Cần: matplotlib."""
import json, math, datetime as dt
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

RATE = 100_000  # VND / giờ công (giả định, giống mẫu)
START = dt.date(2026, 8, 24)  # Thứ Hai

# id: (tên, WBS, O, M, P, giờ công)
ACT = {
 "A": ("Repo setup, CI/CD & Firebase", "1.1.1, 1.1.2", 7, 10, 13, 80),
 "B": ("Backend Auth & RBAC", "1.2.1", 5, 7.5, 10, 60),
 "C": ("Backend Menu, Category & Branch", "1.2.2", 5, 7.5, 10, 60),
 "D": ("Backend Cart & Order lifecycle", "1.2.3", 7, 10, 13, 80),
 "E": ("Backend VietQR & Casso webhook", "1.2.4", 5, 7.5, 10, 60),
 "F": ("Customer App Auth & Home/Menu", "1.3.1, 1.3.2", 8, 12.5, 17, 100),
 "G": ("Customer App Cart, Checkout & VietQR", "1.3.3, 1.3.4", 8, 12.5, 17, 100),
 "H": ("Shipper App Auth & Order feed", "1.4.1, 1.4.2", 8, 12.5, 17, 100),
 "I": ("Shipper App Delivery & COD", "1.4.4", 4, 5, 6, 40),
 "J": ("Admin Web Menu & Dispatch", "1.5.2, 1.5.3", 10, 15, 20, 120),
 "K": ("AI Dataset, Training & Flask API", "1.6.1-1.6.3", 15, 22.5, 30, 180),
 "L": ("System E2E integration testing", "1.7.1", 7, 10, 13, 80),
 "M": ("Production deployment & handover", "1.7.2", 4, 5, 6, 40),
}
PRED_ORIG = {"A": [], "B": ["A"], "C": ["B"], "D": ["B", "C"], "E": ["D"], "F": ["B", "C"],
             "G": ["E", "F"], "H": ["D"], "I": ["H", "G"], "J": ["C", "D"], "K": ["A"],
             "L": ["G", "I", "J"], "M": ["L"]}

ACT2 = dict(ACT)
ACT2["L"] = ("System E2E integration testing", "1.7.1", 5, 7.5, 10, 80)
ACT2["N"] = ("Should/Could feature set", "1.2.5, 1.3.5, 1.3.6, 1.4.3, 1.5.1, 1.5.4, 1.6.4", 10, 15, 20, 380)
PRED_NEW = {"A": [], "B": ["A"], "C": ["A"], "D": ["B", "C"], "E": ["D"], "F": ["B", "C"],
            "G": ["D", "F"], "H": ["D"], "I": ["H", "G"], "J": ["C", "D"], "K": ["A"],
            "N": ["D"], "L": ["E", "G", "I", "J", "K", "N"], "M": ["L"]}


def te(a): return round((a[2] + 4 * a[3] + a[4]) / 6, 2)
def var(a): return round(((a[4] - a[2]) / 6) ** 2, 2)


def cpm(acts, pred):
    order, seen = [], set()
    def visit(n):
        if n in seen: return
        for p in pred[n]: visit(p)
        seen.add(n); order.append(n)
    for n in pred: visit(n)
    ES, EF = {}, {}
    for n in order:
        ES[n] = max([EF[p] for p in pred[n]], default=0); EF[n] = ES[n] + te(acts[n])
    T = max(EF.values())
    succ = {n: [m for m in pred if n in pred[m]] for n in pred}
    LS, LF = {}, {}
    for n in reversed(order):
        LF[n] = min([LS[s] for s in succ[n]], default=T); LS[n] = LF[n] - te(acts[n])
    res = {n: dict(id=n, name=acts[n][0], wbs=acts[n][1], O=acts[n][2], M=acts[n][3], P=acts[n][4],
                   hours=acts[n][5], te=te(acts[n]), var=var(acts[n]), pred=pred[n], ES=ES[n], EF=EF[n],
                   LS=round(LS[n], 2), LF=round(LF[n], 2), slack=round(LS[n] - ES[n], 2)) for n in order}
    crit = [n for n in order if abs(res[n]["slack"]) < 1e-6]
    return order, res, crit, T, math.sqrt(sum(res[n]["var"] for n in crit))


def wday(d):
    date, k = START, 0
    while True:
        if date.weekday() < 5:
            if k == int(d): return date
            k += 1
        date += dt.timedelta(days=1)


def z_prob(target, T, s):
    z = (target - T) / s
    return z, 0.5 * (1 + math.erf(z / math.sqrt(2)))


o1, r1, c1, T1, s1 = cpm(ACT, PRED_ORIG)
o2, r2, c2, T2, s2 = cpm(ACT2, PRED_NEW)
for r in r2.values():
    r["start"] = wday(r["ES"]).strftime("%d/%m"); r["end"] = wday(math.ceil(r["EF"]) - 1).strftime("%d/%m")

WEEKS = 12
def per_week(r, k):
    return r["hours"] * max(0, min(5 * (k + 1), r["EF"]) - max(5 * k, r["ES"])) / (r["EF"] - r["ES"])
per_act_week = {n: [round(per_week(r2[n], k), 1) for k in range(WEEKS)] for n in o2}
pv_week_h = [sum(per_week(r2[n], k) for n in o2) for k in range(WEEKS)]
BAC = sum(r["hours"] for r in r2.values()) * RATE

# ---- Kịch bản GIẢ ĐỊNH cuối tuần 6 (ngày làm việc 30) ----
DAY6 = 30
planned_pct = {n: max(0, min(1, (DAY6 - r2[n]["ES"]) / (r2[n]["EF"] - r2[n]["ES"]))) for n in o2}
actual_pct = {"A": 1, "B": 1, "C": 1, "D": 1, "E": 0.50, "F": 1, "G": 0.20, "H": 0.30,
              "I": 0, "J": 0.25, "K": 0.60, "N": 0, "L": 0, "M": 0}
actual_h = {"A": 88, "B": 66, "C": 58, "D": 92, "E": 36, "F": 110, "G": 22, "H": 32,
            "I": 0, "J": 34, "K": 120, "N": 0, "L": 0, "M": 0}
rows6 = []
for n in o2:
    r = r2[n]
    rows6.append(dict(id=n, name=r["name"], bac=r["hours"] * RATE, plan_pct=round(planned_pct[n] * 100),
                      act_pct=round(actual_pct[n] * 100), PV=round(r["hours"] * planned_pct[n] * RATE),
                      EV=round(r["hours"] * actual_pct[n] * RATE), AC=round(actual_h[n] * RATE)))
PV6 = sum(x["PV"] for x in rows6); EV6 = sum(x["EV"] for x in rows6); AC6 = sum(x["AC"] for x in rows6)
CV, SV = EV6 - AC6, EV6 - PV6; CPI, SPI = EV6 / AC6, EV6 / PV6
IEAC = BAC / CPI; VAC = BAC - IEAC; SAC = T2 / 5; ISAC = SAC / SPI; ETC = IEAC - AC6

pv_cum = [sum(pv_week_h[:k + 1]) * RATE for k in range(WEEKS)]
spi_path = [1.0, 0.99, 0.97, 0.95, 0.92, SPI]; cpi_path = [1.0, 0.98, 0.96, 0.94, 0.92, CPI]
ev_cum = [pv_cum[k] * spi_path[k] for k in range(6)]; ev_cum[5] = EV6
ac_cum = [ev_cum[k] / cpi_path[k] for k in range(6)]; ac_cum[5] = AC6

# ---------------- Hình ----------------
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 9})

def draw_pert(res, order, crit, fname, title, T):
    level = {}
    for n in order: level[n] = max([level[p] + 1 for p in res[n]["pred"]], default=0)
    cols = {}
    for n in order: cols.setdefault(level[n], []).append(n)
    pos = {n: (lv * 2.6, -(i - (len(ns) - 1) / 2) * 1.6) for lv, ns in cols.items() for i, n in enumerate(ns)}
    fig, ax = plt.subplots(figsize=(13, 6.2))
    for n in order:
        for p in res[n]["pred"]:
            (x1, y1), (x2, y2) = pos[p], pos[n]
            c = n in crit and p in crit and abs(res[p]["EF"] - res[n]["ES"]) < 1e-6
            ax.annotate("", xy=(x2 - 0.95, y2), xytext=(x1 + 0.95, y1),
                        arrowprops=dict(arrowstyle="-|>", color="#C00000" if c else "#7F7F7F", lw=2 if c else 1))
    for n in order:
        (x, y), r, c = pos[n], res[n], n in crit
        ax.add_patch(FancyBboxPatch((x - 0.95, y - 0.55), 1.9, 1.1, boxstyle="round,pad=0.02",
                     fc="#FDE9E7" if c else "#EAF1FB", ec="#C00000" if c else "#2F5597", lw=1.6))
        ax.text(x, y + 0.28, f"{n}  (te={r['te']:g})", ha="center", weight="bold")
        ax.text(x, y + 0.02, f"ES {r['ES']:g} | EF {r['EF']:g}", ha="center", fontsize=8)
        ax.text(x, y - 0.22, f"LS {r['LS']:g} | LF {r['LF']:g}", ha="center", fontsize=8)
        ax.text(x, y - 0.44, f"Slack {r['slack']:g}", ha="center", fontsize=8, color="#C00000" if c else "#333")
    ax.set_title(f"{title} — project duration {T:g} working days (red = critical path)", fontsize=11)
    ax.axis("off"); ax.set_aspect("equal")
    xs = [p[0] for p in pos.values()]; ys = [p[1] for p in pos.values()]
    ax.set_xlim(min(xs) - 1.2, max(xs) + 1.2); ax.set_ylim(min(ys) - 0.9, max(ys) + 0.9)
    fig.tight_layout(); fig.savefig(fname, dpi=170); plt.close(fig)

draw_pert(r1, o1, c1, "pert_original.png", "Original PERT network", T1)
draw_pert(r2, o2, c2, "pert_revised.png", "Revised PERT network", T2)

fig, ax = plt.subplots(figsize=(12, 6))
for i, n in enumerate(o2):
    r, c = r2[n], n in c2
    ax.barh(i, r["EF"] - r["ES"], left=r["ES"], color="#C00000" if c else "#4472C4", height=0.6)
    if r["slack"] > 0: ax.barh(i, r["slack"], left=r["EF"], color="none", edgecolor="#4472C4", hatch="///", height=0.6, lw=0.6)
    ax.text(r["ES"] + 0.3, i, n, va="center", color="white", weight="bold", fontsize=8)
ax.set_yticks(range(len(o2))); ax.set_yticklabels([f"{n}. {r2[n]['name'][:38]}" for n in o2]); ax.invert_yaxis()
ticks = list(range(0, int(T2) + 1, 5)); ax.set_xticks(ticks)
ax.set_xticklabels([f"W{t//5+1}\n{wday(t).strftime('%d/%m')}" if t < T2 else f"End\n{wday(T2-1).strftime('%d/%m')}" for t in ticks], fontsize=7)
ax.grid(axis="x", ls=":", color="#999"); ax.set_xlim(0, T2)
ax.set_title(f"Gantt chart (revised plan, {T2:g} working days = {T2/5:g} weeks, 24/08 – {wday(T2-1).strftime('%d/%m/%Y')}); red = critical, hatched = slack")
fig.tight_layout(); fig.savefig("gantt.png", dpi=170); plt.close(fig)

wk = list(range(1, WEEKS + 1))
fig, ax = plt.subplots(figsize=(9, 4.6))
ax.plot(wk, [v / 1e6 for v in pv_cum], "-o", label="PV (planned value)", color="#4472C4")
ax.plot(wk[:6], [v / 1e6 for v in ev_cum], "-s", label="EV (earned value) — assumed", color="#70AD47")
ax.plot(wk[:6], [v / 1e6 for v in ac_cum], "-^", label="AC (actual cost) — assumed", color="#C00000")
ax.axvline(6, ls="--", color="#999"); ax.text(6.1, max(pv_cum) / 1e6 * 0.05, "Status date: end of Week 6", fontsize=8)
ax.set_xlabel("Week"); ax.set_ylabel("Million VND (cumulative)"); ax.set_xticks(wk); ax.grid(ls=":"); ax.legend()
ax.set_title("Cumulative PV / EV / AC"); fig.tight_layout(); fig.savefig("scurve.png", dpi=170); plt.close(fig)

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(wk[:6], [ev_cum[k] / ac_cum[k] for k in range(6)], "-o", label="CPI", color="#C00000")
ax.plot(wk[:6], [ev_cum[k] / pv_cum[k] for k in range(6)], "-s", label="SPI", color="#4472C4")
ax.axhline(1.0, color="#333", lw=1); ax.set_ylim(0.75, 1.1); ax.set_xticks(wk[:6]); ax.set_xlabel("Week")
ax.set_title("CPI and SPI trend, Weeks 1–6 (assumed scenario)"); ax.grid(ls=":"); ax.legend()
fig.tight_layout(); fig.savefig("cpi_spi.png", dpi=170); plt.close(fig)

z1, p1 = z_prob(60, T1, s1); z2, p2 = z_prob(60, T2, s2)
json.dump(dict(rate=RATE, BAC=BAC,
               orig=dict(order=o1, res=r1, crit=c1, T=T1, sigma=s1, z=z1, p=p1),
               rev=dict(order=o2, res=r2, crit=c2, T=T2, sigma=s2, z=z2, p=p2, end=wday(T2 - 1).strftime("%d/%m/%Y")),
               pv_week=[round(h * RATE) for h in pv_week_h], pv_cum=[round(v) for v in pv_cum], per_act_week=per_act_week,
               week6=dict(rows=rows6, PV=PV6, EV=EV6, AC=AC6, CV=CV, SV=SV, CPI=CPI, SPI=SPI, IEAC=IEAC, VAC=VAC,
                          SAC=SAC, ISAC=ISAC, ETC=ETC, date=wday(DAY6 - 1).strftime("%d/%m/%Y"))),
          open("data.json", "w"), indent=1, default=str)
print(f"orig T={T1} crit={c1} sigma={s1:.2f} | rev T={T2} crit={c2} sigma={s2:.2f} P={p2:.2f}")
print(f"BAC={BAC:,} PV6={PV6:,.0f} EV6={EV6:,} AC6={AC6:,} CPI={CPI:.3f} SPI={SPI:.3f}")
