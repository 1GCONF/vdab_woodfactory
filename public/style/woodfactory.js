window.onload = () => {
  const cursus = [
    "houtsoorten herkennen",
    "planken zagen",
    "parketvloer leggen",
    "hout beitsen",
    "houtbewerking",
  ];
  function appendCursusOptie(cursus_array) {
    const select = document.getElementById("cursus");
    cursus_array.forEach((cursusnaam) => {
      const option = document.createElement("option");
      option.className = "cursusoptie";
      option.value = cursusnaam;
      option.innerHTML = cursusnaam;
      select.append(option);
    });
    select.addEventListener("change", function () {
      handleOptieSelect("./cursussen.json", this.value);
    });
    return select;
  }
  function handleOptieSelect(src, optionValue) {
    (async () => {
      await fetch(src)
        .then((response) => response.json())
        .then((jsonArray) => {
          console.log(jsonArray);
          const outputTarget = document.querySelector("#cursusDetail");
          outputTarget.style.visibility = "visible";
          outputTarget.style.display = "block";
          jsonArray.forEach((jsonObj) => {
            const { naam, duurtijd, prijs } = jsonObj;
            if (optionValue === naam) {
              outputTarget.innerHTML = `<span>duurtijd: ${duurtijd}, prijs: €${prijs}</span>`;
            } else if (!optionValue) {
              outputTarget.style.visibility = "hidden";
              outputTarget.style.display = "none";
            }
          });
        })
        .catch((e) => console.log(e));
    })();
  }
  function handleCheckbox() {
    this.checked;
  }
  function appendBestelGegevens(src, parentE) {
    (async () => {
      await fetch(src)
        .then((response) => response.json())
        .then((jsondata) => {
          for (const jsonObj of jsondata) {
            //control label
            const control_label = document.createElement("label");
            const inputCheckbox = document.createElement("input");

            control_label.id = `chk_${jsonObj.naam}`;
            control_label.className = "control-label";
            control_label.textContent = jsonObj.naam;

            inputCheckbox.type = "checkbox";
            inputCheckbox.id = `chk_${jsonObj.naam}`;

            control_label.append(inputCheckbox);
            //controls
            const controls = document.createElement("div");
            const input_div = document.createElement("div");
            const input_number = document.createElement("input");
            const span_add_on = document.createElement("span");
            input_div.append(input_number, span_add_on);
            controls.append(input_div);
            controls.className = "controls";

            input_div.className = "input_div";
            input_number.classList.add("inpbox", "input-mini");
            input_number.classList.add(jsonObj.naam);
            input_number.required = true;
            input_number.type = "number";
            input_number.min = "1";
            input_number.id = `${jsonObj.naam}`;
            input_number.name = `${jsonObj.naam}`;
            input_number.disabled = true;
            span_add_on.className = "add_on";
            span_add_on.innerHTML = jsonObj.eenheid;
            // Append
            parentE
              .querySelector(".control-group")
              .append(control_label, controls);
            // init listeners
            inputCheckbox.addEventListener("click", handleCheckbox);
          }
        })
        .catch((e) => console.log(e));
    })();
  }
  appendCursusOptie(cursus);
  appendBestelGegevens(
    "./houtsoorten.json",
    document.querySelector("#houtsoorten")
  );
};
