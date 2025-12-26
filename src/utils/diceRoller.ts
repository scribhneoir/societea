import DiceBox from "@3d-dice/dice-box";

let diceBox: DiceBox | null = null;
let currentRollLabel = "";
let currentTarget = 0;
let currentUnder = true;
let cleanupTimer: number | null = null;
const CLEANUP_DELAY = 4000;
const FADE_DURATION = 300;

async function initializeDiceBox(): Promise<void> {
  diceBox = new DiceBox({
    id: "dice-box-container",
    assetPath: "/assets/dice-box/",
    theme: "smooth-pip",
    themeColor: "#ffffff",
    scale: 6,
  });

  await diceBox.init();

  diceBox.onRollComplete = (results: any) => {
    displayRollResults(results);
    cleanupTimer = window.setTimeout(cleanupDiceBox, CLEANUP_DELAY);
  };
}

export async function roll2d6(
  label: string,
  target: number,
  _reroll = false,
  under = true
): Promise<void> {
  currentRollLabel = label;
  currentTarget = target;
  currentUnder = under;

  // Cancel any pending cleanup
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }

  // Force complete unmount if dice box exists
  if (diceBox) {
    await cleanupDiceBox();
  }

  // Remount fresh dice box
  await initializeDiceBox();

  if (!diceBox) return;

  const canvas = document.querySelector(
    "#dice-box-container canvas"
  ) as HTMLElement;
  if (canvas) {
    canvas.style.opacity = "1";
    canvas.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
  }

  await diceBox.roll("2dpip");
}

function displayRollResults(results: any): void {
  const rollGroup = results?.[0];
  const adjustedValues =
    rollGroup?.rolls?.map((die: any) => {
      const value = die.value || die.groupValue || 0;
      return value === 6 ? 0 : value;
    }) || [];

  const total = adjustedValues.reduce(
    (sum: number, val: number) => sum + val,
    0
  );
  // const values = adjustedValues.join(", ");

  const success = currentUnder
    ? total <= currentTarget
    : total >= currentTarget;
  // const reroll = currentReroll && !success;

  const notification = document.createElement("div");
  notification.className = "dice-result-notification";
  notification.innerHTML = `
    <div class="dice-result-content ${
      success ? "dice-result-success" : "dice-result-failure"
    }">
      <strong>${currentRollLabel || "Roll"}</strong>
      <strong>${success ? "Success" : "Failure"}</strong>
      <div class="dice-result-total">Total: ${total}</div>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), FADE_DURATION);
  }, CLEANUP_DELAY);
}

async function cleanupDiceBox(): Promise<void> {
  if (!diceBox) return;

  // Cancel any pending cleanup timer
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }

  const canvas = document.querySelector(
    "#dice-box-container canvas"
  ) as HTMLElement;
  if (canvas) {
    canvas.style.opacity = "0";
    canvas.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
    await new Promise((resolve) => setTimeout(resolve, FADE_DURATION));
  }

  await diceBox.clear();
  await diceBox.hide();

  if (canvas?.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }

  diceBox = null;
}

export async function clearDice(): Promise<void> {
  await cleanupDiceBox();
}

export async function roll3d6ForAbilityPoints(
  onResult: (total: number) => void
): Promise<void> {
  // Cancel any pending cleanup
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }

  // Force complete unmount if dice box exists
  if (diceBox) {
    await cleanupDiceBox();
  }

  // Remount fresh dice box
  await initializeDiceBox();

  if (!diceBox) return;

  const canvas = document.querySelector(
    "#dice-box-container canvas"
  ) as HTMLElement;
  if (canvas) {
    canvas.style.opacity = "1";
    canvas.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
  }

  // Override the roll complete handler for this specific roll
  diceBox.onRollComplete = (results: any) => {
    const rollGroup = results?.[0];
    const values =
      rollGroup?.rolls?.map((die: any) => {
        const value = die.value || die.groupValue || 0;
        return value === 6 ? 0 : value;
      }) || [];

    // Sort values and remove the highest
    const sortedValues = [...values].sort((a, b) => b - a);
    const discardedValue = sortedValues[0];
    const keptValues = sortedValues.slice(1);
    const total = keptValues.reduce((sum: number, val: number) => sum + val, 0);
    const finalPoints = 16 + total;

    // Display notification
    const notification = document.createElement("div");
    notification.className = "dice-result-notification";
    notification.innerHTML = `
      <div class="dice-result-content">
        <strong>Ability Points Roll</strong>
        <div class="dice-result-total">Rolled: ${values.join(", ")}</div>
        <div class="dice-result-total">Discarded highest: ${discardedValue}</div>
        <div class="dice-result-total">Kept: ${keptValues.join(
          ", "
        )} = ${total}</div>
        <div class="dice-result-total"><strong>Total Points: 16 + ${total} = ${finalPoints}</strong></div>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), FADE_DURATION);
    }, CLEANUP_DELAY);

    // Call the callback with the result
    onResult(finalPoints);

    // Schedule cleanup
    cleanupTimer = window.setTimeout(cleanupDiceBox, CLEANUP_DELAY);
  };

  await diceBox.roll("3dpip");
}
