
    (() => {

      /* =========================================================
         DOM
      ========================================================= */

      const priceInput =
        document.getElementById("car-price");

      const engineVolumeInput =
        document.getElementById("engine-volume");

      const engineVolumeField =
        document.getElementById("engine-volume-field");

      const engineInputs =
        document.querySelectorAll(
          'input[name="engine"]'
        );

      const ageInputs =
        document.querySelectorAll(
          'input[name="age"]'
        );

      const benefitCheckbox =
        document.getElementById("discount");

      const electricBenefitOption = document.getElementById("electric-benefit-option");
      const electricDiscount = document.getElementById("electric-discount");

      function updateElectricBenefit() {
        const visible = getSelectedEngine() === "electric" && !benefitCheckbox.checked;
        electricBenefitOption.hidden = !visible;
        electricDiscount.disabled = !visible;
      }

      const benefitTitle =
        document.getElementById("benefit-title");

      const benefitDescription =
        document.getElementById("benefit-description");

      const vatRow =
        document.getElementById("vat-row");

      const resultDuty =
        document.getElementById("result-duty");

      const resultVat =
        document.getElementById("result-vat");

      const resultCustomsFee =
        document.getElementById("result-customs-fee");

      const resultRecycling =
        document.getElementById("result-recycling");

      const resultStorage =
        document.getElementById("result-storage");

      const resultTotal =
        document.getElementById("result-total");

      const resultTotalByn =
        document.getElementById("result-total-byn");

      const usdRateElement =
        document.getElementById("usd-rate");

      const eurRateElement =
        document.getElementById("eur-rate");

      const ratesDateElement =
        document.getElementById("rates-date");

      const ratesSourceElement =
        document.getElementById("rates-source");


      /* =========================================================
         КУРСЫ НБРБ + КЭШ ПОСЛЕДНЕГО УСПЕШНОГО КУРСА
      ========================================================= */

      const RATE_CACHE_KEY =
        "rb-customs-calculator-nbrb-rates-v1";

      let usdToByn = null;
      let eurToByn = null;


      function saveRatesToCache(usd, eur, date) {

        try {
          localStorage.setItem(
            RATE_CACHE_KEY,
            JSON.stringify({
              usd,
              eur,
              date,
              savedAt: new Date().toISOString()
            })
          );
        } catch (error) {
          console.warn(
            "Не удалось сохранить курс в localStorage:",
            error
          );
        }
      }


      function getCachedRates() {

        try {

          const raw =
            localStorage.getItem(
              RATE_CACHE_KEY
            );

          if (!raw) {
            return null;
          }

          const data =
            JSON.parse(raw);

          if (
            !Number.isFinite(Number(data.usd)) ||
            !Number.isFinite(Number(data.eur))
          ) {
            return null;
          }

          return {
            usd: Number(data.usd),
            eur: Number(data.eur),
            date: data.date || ""
          };

        } catch (error) {

          console.warn(
            "Не удалось прочитать сохранённый курс:",
            error
          );

          return null;
        }
      }


      function showRates(
        usd,
        eur,
        date,
        source = "live"
      ) {

        usdToByn = usd;
        eurToByn = eur;

        usdRateElement.textContent =
          `${formatRate(usdToByn)} BYN`;

        eurRateElement.textContent =
          `${formatRate(eurToByn)} BYN`;

        usdRateElement.classList.remove(
          "calculator-rates__error"
        );

        eurRateElement.classList.remove(
          "calculator-rates__error"
        );

        if (date) {

          const parsed =
            new Date(date);

          if (!Number.isNaN(parsed.getTime())) {

            ratesDateElement.textContent =
              `на ${parsed.toLocaleDateString("ru-RU")}`;

          } else {

            ratesDateElement.textContent =
              `на ${date}`;
          }

        } else {

          ratesDateElement.textContent = "";
        }

        if (source === "cache") {

          ratesSourceElement.textContent =
            "· сохранённый курс";

          ratesSourceElement.classList.add(
            "is-cached"
          );

        } else {

          ratesSourceElement.textContent =
            "· актуальный";

          ratesSourceElement.classList.remove(
            "is-cached"
          );
        }

        calculate();
      }


      async function loadNBRBRates() {

        /*
          Сначала показываем последний успешно
          сохранённый курс. Это позволяет калькулятору
          работать сразу даже при временной недоступности API.
        */

        const cached =
          getCachedRates();

        if (cached) {

          showRates(
            cached.usd,
            cached.eur,
            cached.date,
            "cache"
          );
        }


        /*
          Затем пробуем получить свежий курс НБРБ.
          Если запрос успешен — заменяем сохранённый
          курс и обновляем localStorage.
        */

        try {

          const response =
            await fetch(
              "https://api.nbrb.by/exrates/rates?periodicity=0",
              {
                cache: "no-store"
              }
            );

          if (!response.ok) {
            throw new Error(
              "Не удалось получить курс НБРБ"
            );
          }

          const rates =
            await response.json();

          const usd =
            rates.find(
              item =>
                item.Cur_Abbreviation === "USD"
            );

          const eur =
            rates.find(
              item =>
                item.Cur_Abbreviation === "EUR"
            );

          if (!usd || !eur) {
            throw new Error(
              "USD или EUR отсутствует в ответе НБРБ"
            );
          }


          const currentUsd =
            Number(usd.Cur_OfficialRate) /
            Number(usd.Cur_Scale);

          const currentEur =
            Number(eur.Cur_OfficialRate) /
            Number(eur.Cur_Scale);

          const currentDate =
            usd.Date || eur.Date || "";


          saveRatesToCache(
            currentUsd,
            currentEur,
            currentDate
          );

          showRates(
            currentUsd,
            currentEur,
            currentDate,
            "live"
          );

        } catch (error) {

          console.error(error);

          /*
            Если кэш уже был — ничего не ломаем:
            пользователь продолжает видеть последний
            загруженный курс.
          */

          if (cached) {

            ratesSourceElement.textContent =
              "· сохранённый курс, НБРБ недоступен";

            ratesSourceElement.classList.add(
              "is-cached"
            );

            return;
          }


          /*
            Если сайт открылся впервые и кэша ещё нет,
            расчёт валютозависимых платежей невозможен.
          */

          usdRateElement.textContent =
            "недоступен";

          eurRateElement.textContent =
            "недоступен";

          ratesDateElement.textContent = "";

          ratesSourceElement.textContent =
            "· нет сохранённого курса";

          usdRateElement.classList.add(
            "calculator-rates__error"
          );

          eurRateElement.classList.add(
            "calculator-rates__error"
          );

          calculate();
        }
      }


      /* =========================================================
         HELPERS
      ========================================================= */

      function getNumericInputValue(input) {

        const value =
          input.value
            .replace(/\s/g, "")
            .replace(/[^\d]/g, "");

        return Number(value) || 0;
      }


      function getPriceUSD() {
        return getNumericInputValue(
          priceInput
        );
      }


      function getEngineVolume() {
        return getNumericInputValue(
          engineVolumeInput
        );
      }


      function getSelectedEngine() {

        return document.querySelector(
          'input[name="engine"]:checked'
        )?.value;
      }


      function getSelectedAge() {

        return document.querySelector(
          'input[name="age"]:checked'
        )?.value;
      }


      function formatRate(value) {

        return new Intl.NumberFormat(
          "ru-RU",
          {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          }
        ).format(value);
      }


      function formatEUR(value) {

        return new Intl.NumberFormat(
          "ru-RU",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        ).format(value) + " €";
      }


      function formatBYN(value) {

        return new Intl.NumberFormat(
          "ru-RU",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        ).format(value) + " BYN";
      }


      function formatUSD(value) {

        return new Intl.NumberFormat(
          "ru-RU",
          {
            maximumFractionDigits: 0
          }
        ).format(value) + " USD";
      }


      function resetCalculatedRows() {

        resultDuty.textContent = "—";
        resultVat.textContent = "—";
        resultCustomsFee.textContent = "—";
        resultTotal.textContent = "—";

        resultTotalByn.textContent =
          "Таможенные расходы";
      }


      function priceUsdToEur(priceUSD) {

        if (
          !priceUSD ||
          !usdToByn ||
          !eurToByn
        ) {
          return 0;
        }

        return (
          priceUSD *
          usdToByn /
          eurToByn
        );
      }


      /* =========================================================
         ЛЬГОТА / КВОТА
      ========================================================= */

      function updateBenefitLabel() {
        updateElectricBenefit();

        const engine =
          getSelectedEngine();

        if (engine === "electric") {

          benefitTitle.textContent =
            "Растаможка по квоте";

          benefitDescription.textContent =
            "Таможенная пошлина 0%";

        } else {

          benefitTitle.textContent =
            "Льготная растаможка";

          benefitDescription.textContent =
            "Указ №140";
        }
      }


      /* =========================================================
         ВИДИМОСТЬ ПОЛЕЙ
      ========================================================= */

      function updateDynamicFields() {

        const engine =
          getSelectedEngine();

        /*
          Объём двигателя нужен только для
          ДВС / параллельного гибрида.
        */

        engineVolumeField.hidden =
          engine !== "ice";


        /*
          НДС показываем только:
          1) для последовательного гибрида;
          2) для электромобиля старше 5 лет.

          Для ДВС / параллельного гибрида,
          а также для электро до 5 лет
          строка НДС полностью скрыта.
        */

        const age =
          getSelectedAge();

        if (
          engine === "series-hybrid" ||
          (
            engine === "electric" &&
            age === "over-5"
          )
        ) {
          vatRow.hidden = false;
        } else {
          vatRow.hidden = true;
        }
      }


      /* =========================================================
         УТИЛЬСБОР
      ========================================================= */

      function getRecyclingFee() {

        const age =
          getSelectedAge();

        if (age === "under-3") {
          return 625;
        }

        return 1282;
      }


      /* =========================================================
         ПОШЛИНА ДВС / ПАРАЛЛЕЛЬНЫЙ ГИБРИД
         По присланной таблице ЕЭК.
      ========================================================= */

      function getIceDutyEUR(
        priceEUR,
        volumeCc,
        age
      ) {

        if (
          !priceEUR ||
          !volumeCc
        ) {
          return 0;
        }


        /*
          Автомобили до 3 лет:

          MAX(
            процент от стоимости,
            ставка за 1 см³ × объём
          )
        */

        if (age === "under-3") {

          let percent = 0;
          let minRatePerCc = 0;

          if (priceEUR <= 8500) {

            percent = 0.54;
            minRatePerCc = 2.5;

          } else if (priceEUR <= 16700) {

            percent = 0.48;
            minRatePerCc = 3.5;

          } else if (priceEUR <= 42300) {

            percent = 0.48;
            minRatePerCc = 5.5;

          } else if (priceEUR <= 84500) {

            percent = 0.48;
            minRatePerCc = 7.5;

          } else if (priceEUR <= 169000) {

            percent = 0.48;
            minRatePerCc = 15;

          } else {

            percent = 0.48;
            minRatePerCc = 20;
          }

          return Math.max(
            priceEUR * percent,
            volumeCc * minRatePerCc
          );
        }


        /*
          Автомобили 3–5 лет:
          ставка EUR за 1 см³.
        */

        if (age === "3-5") {

          let ratePerCc;

          if (volumeCc <= 1000) {
            ratePerCc = 1.5;
          } else if (volumeCc <= 1500) {
            ratePerCc = 1.7;
          } else if (volumeCc <= 1800) {
            ratePerCc = 2.5;
          } else if (volumeCc <= 2300) {
            ratePerCc = 2.7;
          } else if (volumeCc <= 3000) {
            ratePerCc = 3.0;
          } else {
            ratePerCc = 3.6;
          }

          return volumeCc * ratePerCc;
        }


        /*
          Автомобили старше 5 лет:
          ставка EUR за 1 см³.
        */

        let ratePerCc;

        if (volumeCc <= 1000) {
          ratePerCc = 3.0;
        } else if (volumeCc <= 1500) {
          ratePerCc = 3.2;
        } else if (volumeCc <= 1800) {
          ratePerCc = 3.5;
        } else if (volumeCc <= 2300) {
          ratePerCc = 4.8;
        } else if (volumeCc <= 3000) {
          ratePerCc = 5.0;
        } else {
          ratePerCc = 5.7;
        }

        return volumeCc * ratePerCc;
      }


      /* =========================================================
         ОБЩИЙ ИТОГ
      ========================================================= */

      function renderTotal({
        dutyEUR = 0,
        vatEUR = 0,
        customsFeeBYN = 0,
        recyclingFee,
        storageFee
      }) {

        if (
          !usdToByn ||
          !eurToByn
        ) {

          resultTotal.textContent = "—";
          resultTotalByn.textContent =
            "Таможенные расходы";

          return;
        }

        const dutyBYN =
          dutyEUR * eurToByn;

        const vatBYN =
          vatEUR * eurToByn;

        const totalBYN =
          dutyBYN +
          vatBYN +
          customsFeeBYN +
          recyclingFee +
          storageFee;

        const totalUSD =
          totalBYN / usdToByn;

        resultTotal.textContent =
          "≈ " +
          formatUSD(totalUSD);

        resultTotalByn.textContent =
          formatBYN(totalBYN);
      }


      /* =========================================================
         ОСНОВНОЙ РАСЧЁТ
      ========================================================= */

      function calculate() {

        const priceUSD =
          getPriceUSD();

        const engine =
          getSelectedEngine();

        const age =
          getSelectedAge();

        const recyclingFee =
          getRecyclingFee();

        const storageFee =
          700;

        const benefitEnabled =
          benefitCheckbox.checked;


        updateDynamicFields();


        resultRecycling.textContent =
          formatBYN(recyclingFee);

        resultStorage.textContent =
          formatBYN(storageFee);


        /* -------------------------------------------------------
           ПОСЛЕДОВАТЕЛЬНЫЙ ГИБРИД
        ------------------------------------------------------- */

        if (engine === "series-hybrid") {

          if (
            !priceUSD ||
            !usdToByn ||
            !eurToByn
          ) {

            resetCalculatedRows();
            return;
          }

          const priceEUR =
            priceUsdToEur(priceUSD);


          /*
            СНАЧАЛА ВСЕГДА СЧИТАЕМ БЕЗ ЛЬГОТЫ.

            Полная таможенная пошлина:
            15% от стоимости автомобиля в EUR.
          */

          const fullDutyEUR =
            priceEUR * 0.15;


          /*
            Полный НДС:
            20% от суммы:

            стоимость автомобиля
            +
            ПОЛНАЯ пошлина 15%.

            Важно:
            льготную пошлину для базы НДС
            никогда не используем.
          */

          const fullVatEUR =
            (
              priceEUR +
              fullDutyEUR
            ) * 0.20;


          /*
            Только ПОСЛЕ полного расчёта
            применяем льготу.

            Если льгота включена:
            - пошлина делится на 2;
            - уже рассчитанный НДС делится на 2.

            Пример:
            10 000 EUR
            пошлина = 1 500 EUR
            НДС = 2 300 EUR

            со льготой:
            пошлина = 750 EUR
            НДС = 1 150 EUR
          */

          const dutyEUR =
            benefitEnabled
              ? fullDutyEUR / 2
              : fullDutyEUR;

          const vatEUR =
            benefitEnabled
              ? fullVatEUR / 2
              : fullVatEUR;


          const customsFeeBYN =
            dutyEUR > 0
              ? 120
              : 0;


          resultDuty.textContent =
            formatEUR(dutyEUR);

          resultVat.textContent =
            formatEUR(vatEUR);

          resultCustomsFee.textContent =
            formatBYN(customsFeeBYN);


          renderTotal({
            dutyEUR,
            vatEUR,
            customsFeeBYN,
            recyclingFee,
            storageFee
          });

          return;
        }


        /* -------------------------------------------------------
           ЭЛЕКТРО
        ------------------------------------------------------- */

        if (engine === "electric") {

          if (
            !priceUSD ||
            !usdToByn ||
            !eurToByn
          ) {

            resetCalculatedRows();
            return;
          }

          const priceEUR =
            priceUsdToEur(priceUSD);


          /*
            Обычная пошлина электромобиля:
            15% от стоимости в EUR.

            При включённой квоте:
            пошлина = 0%.
          */

          const dutyEUR =
            benefitEnabled
              ? 0
              : priceEUR * 0.15 * (electricDiscount.checked ? 0.5 : 1);


          /*
            НДС для электромобиля:
            только если авто старше 5 лет.

            Для электромобилей до 5 лет
            строка НДС вообще скрывается.
          */

          const vatEUR =
            age === "over-5"
              ? (
                  priceEUR +
                  dutyEUR
                ) * 0.20
              : 0;


          const customsFeeBYN =
            dutyEUR > 0
              ? 120
              : 0;


          resultDuty.textContent =
            formatEUR(dutyEUR);

          resultVat.textContent =
            formatEUR(vatEUR);

          resultCustomsFee.textContent =
            formatBYN(customsFeeBYN);


          renderTotal({
            dutyEUR,
            vatEUR,
            customsFeeBYN,
            recyclingFee,
            storageFee
          });

          return;
        }


        /* -------------------------------------------------------
           ДВС / ПАРАЛЛЕЛЬНЫЙ ГИБРИД
        ------------------------------------------------------- */

        if (engine === "ice") {

          const engineVolume =
            getEngineVolume();

          if (
            !priceUSD ||
            !engineVolume ||
            !usdToByn ||
            !eurToByn
          ) {

            resetCalculatedRows();
            return;
          }


          const priceEUR =
            priceUsdToEur(priceUSD);


          let dutyEUR =
            getIceDutyEUR(
              priceEUR,
              engineVolume,
              age
            );


          /*
            Указ №140:
            скидка 50% на таможенную пошлину.
          */

          if (benefitEnabled) {
            dutyEUR *= 0.5;
          }


          const customsFeeBYN =
            dutyEUR > 0
              ? 120
              : 0;


          resultDuty.textContent =
            formatEUR(dutyEUR);

          resultVat.textContent =
            "—";

          resultCustomsFee.textContent =
            formatBYN(customsFeeBYN);


          renderTotal({
            dutyEUR,
            vatEUR: 0,
            customsFeeBYN,
            recyclingFee,
            storageFee
          });

          return;
        }
      }


      /* =========================================================
         ФОРМАТИРОВАНИЕ ЧИСЛОВЫХ ПОЛЕЙ
      ========================================================= */

      function bindIntegerInput(
        input,
        onChange
      ) {

        input.addEventListener(
          "input",
          () => {

            const numbersOnly =
              input.value
                .replace(/[^\d]/g, "");

            if (!numbersOnly) {

              input.value = "";
              onChange();
              return;
            }

            input.value =
              Number(numbersOnly)
                .toLocaleString("ru-RU");

            onChange();
          }
        );
      }


      bindIntegerInput(
        priceInput,
        calculate
      );

      bindIntegerInput(
        engineVolumeInput,
        calculate
      );


      /* =========================================================
         СОБЫТИЯ
      ========================================================= */

      engineInputs.forEach(
        input => {

          input.addEventListener(
            "change",
            () => {

              updateBenefitLabel();
              updateDynamicFields();
              calculate();
            }
          );
        }
      );


      ageInputs.forEach(
        input => {

          input.addEventListener(
            "change",
            calculate
          );
        }
      );


      benefitCheckbox.addEventListener("change", () => {
        updateElectricBenefit();
        calculate();
      });
      electricDiscount.addEventListener("change", calculate);


      /* =========================================================
         INIT
      ========================================================= */

      updateBenefitLabel();
      updateDynamicFields();
      calculate();
      loadNBRBRates();

    })();
  