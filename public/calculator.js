function parseNumber(value) {
  const number = parseFloat((value || '').toString().replace(',', '.'));
  return isNaN(number) ? 0 : number;
}

function formatNumber(value) {
  return isNaN(value) ? '–' : value.toFixed(2).replace('.', ',');
}

function handleOrdersInput(variant) {
  const suffix = variant === 'B' ? 'B' : '';
  const visitors = parseNumber(document.getElementById(`visitors${suffix}`).value);
  const orders = parseNumber(document.getElementById(`orders${suffix}`).value);

  let conversionRate = 0;
  if (visitors > 0) {
    conversionRate = (orders / visitors) * 100;
  }
  const conversionDisplay = document.getElementById(`conversionDisplay${suffix}`);
  if (conversionDisplay) conversionDisplay.textContent = formatNumber(conversionRate);

  if (variant === '') {
    const totalValue = parseNumber(document.getElementById('totalOrderValue').value);
    const avgOrderValue = orders > 0 ? totalValue / orders : 0;
    document.getElementById('orderValueDisplay').textContent = formatNumber(avgOrderValue);
  } else {
    const orderValue = parseNumber(document.getElementById(`orderValue${suffix}`).value);
    const totalDisplay = document.getElementById(`totalOrderValueDisplay${suffix}`);
    if (totalDisplay) totalDisplay.textContent = formatNumber(orderValue * orders);
  }
}

function calculateImpact(variant) {
  const suffix = variant === 'B' ? 'B' : '';
  const visitors = parseNumber(document.getElementById(`visitors${suffix}`).value);
  const orders = parseNumber(document.getElementById(`orders${suffix}`).value);
  const avgOrderValue = variant === 'B'
    ? parseNumber(document.getElementById(`orderValue${suffix}`).value)
    : (orders > 0 ? parseNumber(document.getElementById('totalOrderValue').value) / orders : 0);

  const currentLoad = parseNumber(document.getElementById(`currentLoadTime${suffix}`).value);
  const optimizedLoad = parseNumber(document.getElementById(`optimizedLoadTime${suffix}`).value);
  const scenario = document.getElementById(`scenario${suffix}`).value;
  const customIncrease = parseNumber(document.getElementById(`customIncrease${suffix}`).value);

  let increaseFactor = 0;
  if (scenario === 'custom') {
    increaseFactor = customIncrease / 100;
  } else if (scenario === 'standard') {
    increaseFactor = 0.15;
  } else if (scenario === 'optimistic') {
    increaseFactor = 0.25;
  } else if (scenario === 'conservative') {
    increaseFactor = 0.05;
  } else if (scenario === 'googleStudy') {
    const diff = currentLoad - optimizedLoad;
    increaseFactor = (diff / 0.1) * 0.084;
  } else if (scenario === 'googleTravel') {
    const diff = currentLoad - optimizedLoad;
    increaseFactor = (diff / 0.1) * 0.104;
  } else if (scenario === 'walmart') {
    const diff = currentLoad - optimizedLoad;
    increaseFactor = diff * 0.02; // Apply to conversion rate
  }

  const currentConversionRate = visitors > 0 ? orders / visitors : 0;
  const newConversionRate = currentConversionRate * (1 + increaseFactor);
  const upliftedOrders = newConversionRate * visitors;

  const upliftedRevenue = upliftedOrders * avgOrderValue;
  const currentRevenue = orders * avgOrderValue;

  const deltaRevenue = upliftedRevenue - currentRevenue;
  const monthlyOutput = document.getElementById(`monthlyRevenue${suffix}`);
  const yearlyOutput = document.getElementById(`yearlyRevenue${suffix}`);
  const upliftPercentOutput = document.getElementById(`upliftConversion${suffix}`);

  if (monthlyOutput) monthlyOutput.textContent = `€${formatNumber(deltaRevenue)}`;
  if (yearlyOutput) yearlyOutput.textContent = `€${formatNumber(deltaRevenue * 12)}`;
  if (upliftPercentOutput) upliftPercentOutput.textContent = `${formatNumber(increaseFactor * 100)} %`;
}

document.getElementById('calculateButton').addEventListener('click', () => calculateImpact(''));
document.getElementById('calculateButtonB').addEventListener('click', () => calculateImpact('B'));

document.getElementById('scenario').addEventListener('change', function () {
  document.getElementById('customScenarioGroup').style.display = this.value === 'custom' ? 'block' : 'none';
});
document.getElementById('scenarioB').addEventListener('change', function () {
  document.getElementById('customScenarioGroupB').style.display = this.value === 'custom' ? 'block' : 'none';
});

['orders', 'visitors', 'totalOrderValue'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => handleOrdersInput(''));
});
['ordersB', 'visitorsB', 'orderValueB'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => handleOrdersInput('B'));
});





if (window.matchMedia('(max-width: 991px)').matches) {
  document.addEventListener('DOMContentLoaded', function () {
    const calculateButton = document.getElementById('calculateButton');

    if (calculateButton) {
      calculateButton.addEventListener('click', function () {

        const resultSection = document.querySelector('.card-header');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}


