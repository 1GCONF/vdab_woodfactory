window.onload = () => {
  function appendCursusOptie(src) {
    (async () => {
      await fetch(src)
        .then((response) => response.json())
        .then((data) => {
          const cursus_array = data.map((item) => {
            return item.naam;
          });
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
        });
    })();
  }
  function handleOptieSelect(src, optionValue) {
    (async () => {
      await fetch(src)
        .then((response) => response.json())
        .then((jsonArray) => {
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
        .catch((e) => console.error(e));
    })();
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
            input_number.classList.add("inpbox", "input-mini", jsonObj.naam);
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
            inputCheckbox.addEventListener("click", function () {
              if (!this.checked) {
                input_number.disabled = true;
              } else {
                input_number.disabled = false;
              }
            });
          }
          valideerSubmit();
        })
        .catch((e) => console.log(e));
    })();
  }
  function valideerSubmit() {
    const bestelBoodschappen = document.getElementById("bestelBoodschappen");
    const bestelBoodschappenLijst = document.getElementById(
      "bestelBoodschappenLijst"
    );
    const valideerKnop = document.getElementById("verzenden");

    valideerKnop.addEventListener("click", bestelling_validatie);
    valideerKnop.addEventListener("click", persoon_validatie);
  }
  function bestelling_validatie() {
    const alleCheckBoxen = Array.from(
      document.querySelectorAll("input[type=checkbox]")
    );
    const checkbox_checked = alleCheckBoxen.filter((checkbox) => {
      return checkbox.checked;
    });
    if (checkbox_checked.length > 0) {
      bestelBoodschappen.hidden = false;
      const cache = [];
      checkbox_checked.forEach((checkbox) => {
        const id = checkbox.id.split("").splice(4).join("");
        const input_val = document.querySelector(`.inpbox.input-mini.${id}`);
        if (!Number(input_val.value) > 0) {
          const li = document.createElement("li");
          li.innerText = `${id}: tik een positief getal in`;
          if (!cache.includes(li)) {
            cache.push(li);
          }
        } else {
          bestelBoodschappen.hidden = true;
        }
      });
      console.log(cache);
      Array.from(bestelBoodschappenLijst.children).forEach((child) => {
        child.remove();
      });
      bestelBoodschappenLijst.append(...cache);
    }
  }
  function persoon_validatie() {
    const pers_inputs = document.querySelectorAll(".controls>input");
    const persoonBoodschappen = document.getElementById("persoonBoodschappen");
    const persoonBoodschappenLijst = document.getElementById(
      "persoonBoodschappenLijst"
    );
    const cache = [];
    pers_inputs.forEach((input) => {
      if (!input.value.length > 0) {
        const li = document.createElement("li");
        li.innerText = `${input.id}: verplich veld`;
        if (!cache.includes(li)) {
          cache.push(li);
        }
      }
      console.log(input)
    });
    if (cache.length > 0) {
      persoonBoodschappen.hidden = false;
      Array.from(persoonBoodschappenLijst.children).forEach((child) => {
        child.remove();
      });
      persoonBoodschappenLijst.append(...cache);
    } else {
      persoonBoodschappen.hidden = true;
    }
  }
  appendCursusOptie("./cursussen.json");
  appendBestelGegevens(
    "./houtsoorten.json",
    document.querySelector("#houtsoorten")
  );
};
