async function fetchData() {
  const promise = await fetch("./data.json");
  if (promise.status != 200) return null;
  return await promise.json();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function putOnSessionStorage(key, value) {
  if (sessionStorage.getItem(key)) {
    const array = JSON.parse(sessionStorage.getItem(key));
    array.push(value);
    sessionStorage.setItem(key, JSON.stringify(array));
    return;
  }
  sessionStorage.setItem(key, JSON.stringify([value]));
}

function getOnSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function createQuestionHTML(selected, main, data, index) {
  const div = document.createElement("div");
  const title = document.createElement("h3");
  if (!selected) {
    title.textContent = "Não foi possivel achar outro tópico";
    main.appendChild(title);
    return;
  }

  title.textContent = selected.key;
  div.appendChild(title);

  if (selected.caption) {
    const caption = document.createElement("h4");
    caption.textContent = selected.caption;
    div.appendChild(caption);
  }

  const value = document.createElement("p");
  value.id = "value";
  div.appendChild(value);

  if (selected.type == "equation") {
    value.innerHTML = `\\(${selected.value}\\)`;
  katex.render(selected.value, value, {
    throwOnError: false
  });
  } else {
    value.textContent = selected.value;
  }

  value.style.opacity = "0";

  div.addEventListener("click", () => {
    value.style.opacity = "1";

    const footer = document.getElementsByTagName("footer")[0];
    if(footer.firstElementChild) return;
    const next = document.createElement("button");
    next.textContent = "Próximo";
    footer.appendChild(next);

    next.addEventListener("click", () => {
      div.remove();
      next.remove();
      putOnSessionStorage(data.name, index);
      handleOptionClick(main, data);
    })
  })

  main.appendChild(div);
}

function handleOptionClick(main, data) {
  main.innerHTML = "";

  const back = document.getElementById("voltar");
  back.style.display = "block";
  back.disabled = false;
  back.addEventListener("click", () => { location.reload() })



  let index = -1;
  const done = getOnSessionStorage(data.name);
  if (done) {
    if (data.topics.length > done.length) {
      do {
        index = getRandomInt(data.topics.length);
      } while (done.includes(index));
    }
  } else {
    index = getRandomInt(data.topics.length)
  }

  const selected = data.topics[index];

  createQuestionHTML(selected, main, data, index);

}

async function createOptions() {
  const data = await Promise.resolve(fetchData());
  const mainSection = document.getElementById("main");

  for (let i = 0; i < data.length; i++) {
    const optionButton = document.createElement("button");
    optionButton.textContent = data[i].name;
    optionButton.addEventListener("click", () => {
      handleOptionClick(mainSection, data[i]);
    })

    mainSection.appendChild(optionButton);
  }
}