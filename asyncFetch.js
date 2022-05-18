//не работает
//loadDefaultData();
//window.onload = setSearchEvent();
setSearchEvent();
loadDataAsync('');

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isFormatCorrect(str) {
    if (str.length > 0) {
        if (str.length != 10 && str.length != 21) {
            return false;
        } else
            return true;
    } else
        return false;
}

function checkDates(startDate, endDate) {
    if (startDate > Date.now() || endDate > Date.now()) {
        error('NASA ещё не умеет заглядывать в будущее');

        disableButtonAnimation();

        return false;
    }

    return true;
}

function getDatesFromString(str) {
    var tmp = str.split('-');

    console.log("Стартовая дата:" + tmp[0]);
    var startDateArr = tmp[0].split('.');
    var startDateStr = startDateArr[0] + "-" + startDateArr[1] + "-" + startDateArr[2];

    var startDate = new Date(startDateArr[0], startDateArr[1], startDateArr[2]);
    console.log("Стартовая дата:" + startDate.toString());

    if (tmp[1]) {
        console.log("Конечная дата:" + tmp[1]);

        var endDateArr = tmp[1].split('.');
        var endDateStr = endDateArr[0] + "-" + endDateArr[1] + "-" + endDateArr[2];

        var endDate = new Date(endDateArr[0], endDateArr[1], endDateArr[2]);
        console.log("Конечная дата:" + endDate);
    }

    var datesStr = [];
    if (checkDates(startDate, endDate)) {
        datesStr = [startDateStr, endDateStr];
    } else {
        datesStr = ["", ""];
    }

    return datesStr;
}

async function loadDefaultData() {
    let startDateStr;
    let endDateStr;
    if (localStorage.getItem("startDate")) {
        startDateStr = localStorage.getItem("startDate");
    }
    if (localStorage.getItem("endDate")) {
        endDateStr = localStorage.getItem("endDate");
    }

    console.log("Saved start: ", startDateStr);
    console.log("Saved end: ", endDateStr);

    if (startDateStr !== undefined && endDateStr !== undefined) {
        console.log(1);
        //для списка
        url = `https://api.nasa.gov/planetary/apod?api_key=hL7uo8qiSdg3CNevMEIhPsltANjLeBeVhhC6qSDK&start_date=${startDateStr}&end_date=${endDateStr}&thumbs=true`;
    } else if (startDateStr !== undefined) {
        //конкретная дата
        url = `https://api.nasa.gov/planetary/apod?api_key=hL7uo8qiSdg3CNevMEIhPsltANjLeBeVhhC6qSDK&date=${startDateStr}&thumbs=true`;
    } else {
        //today
        loadDataAsync("");
        return;
    }

    let res;
    let data;
    try {
        res = await fetch(url);
        data = await res.json();

    } catch (err) {
        alert(err.message)
    }

    console.log(data)

    setData(data);
}

async function loadDataAsync(str) {
    const dates = getDatesFromString(str);
    console.log(dates);

    const startDateStr = dates[0];
    const endDateStr = dates[1];

    let url;
    if (startDateStr && endDateStr && !isEmpty(startDateStr) && !isEmpty(endDateStr)) {
        //для списка
        url = `https://api.nasa.gov/planetary/apod?api_key=hL7uo8qiSdg3CNevMEIhPsltANjLeBeVhhC6qSDK&start_date=${startDateStr}&end_date=${endDateStr}&thumbs=true`;
    } else if (str) {
        //конкретная дата
        url = `https://api.nasa.gov/planetary/apod?api_key=hL7uo8qiSdg3CNevMEIhPsltANjLeBeVhhC6qSDK&date=${startDateStr}&thumbs=true`;
    } else {
        //по умолчанию
        url = `https://api.nasa.gov/planetary/apod?api_key=hL7uo8qiSdg3CNevMEIhPsltANjLeBeVhhC6qSDK`;
    }

    let res;
    let data;
    try {
        res = await fetch(url);
        data = await res.json();

        localStorage.setItem("startDate", startDateStr);
        localStorage.setItem("endDate", endDateStr);
    } catch (err) {
        alert(err.message)
    }

    console.log(data)

    setData(data);

    disableButtonAnimation();
}


function setData(data) {
    let container = document.querySelector(".pictures_container");

    const video = `
        <iframe class="nasa_pict"
            src=""
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>`;

    const image = `<img class="nasa_pict" src="sgs" alt="Космос"></img>`;


    if (data.length > 1) {
        container.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            container.innerHTML
                += `
            <li class="big li_item">
                <div class="nasa_container">       
                    <figure class="nasa_pict_container">
                    </figure>

                    <figcaption class="nasa_text_container">
                        <h2 class="pict_name  shining-text">${data[i]["title"]}</h2>
                        <p class="pict_description">${data[i]["explanation"]}</p>
                        <p class="pict_date">${data[i]["date"]}</p>
                    </figcaption>
                </div>
            </li>
            `;
        }


        let mediaArr = document.querySelectorAll(".nasa_pict_container");


        for (let i = 0; i < data.length; i++) {
            console.log(i, data[i]["media_type"])

            switch (data[i]["media_type"]) {
                case "image":
                    mediaArr[i].innerHTML = image;
                    mediaArr[i].firstChild.src = data[i]["hdurl"];
                    break;

                case "video":
                    mediaArr[i].innerHTML = video;
                    mediaArr[i].querySelector(".nasa_pict").src = data[i]["url"];
                    break;
            }
        }

        //первый будет побольше
        //не вышло
        //mediaArr[0].parentElement.parentElement.classList.add("big");

        mediaArr[0].querySelector(".nasa_pict").classList.add("concrete");
        for (let i = 1; i < mediaArr.length; i++) {
            //ужас
            mediaArr[i].parentElement.parentElement.classList.remove("big");
            mediaArr[i].parentElement.parentElement.classList.add("small");
        }

        let textArr = document.querySelectorAll(".nasa_text_container");
        for (let i = 1; i < textArr.length; i++) {
            textArr[i].classList.add("hidden");
        }

    } else {
        //если запрос только на 1 пикчу

        container.innerHTML
            = `
            <li class="big li_item">
            <div class="nasa_container">
                <figure class="nasa_pict_container">
                </figure>
                <figcaption class="nasa_text_container">
                    <h2 class="pict_name shining-text">${data["title"]}</h2>
                    <p class="pict_description">${data["explanation"]}</p>
                    <p class="pict_date">${data["date"]}</p>
                </figcaption>
            </div>
            </li>
            `;

        let media = document.querySelector(".nasa_pict_container");

        switch (data["media_type"]) {
            case "image":
                media.innerHTML = image;
                media.querySelector('.nasa_pict').src = data.hdurl;

                break;

            case "video":
                media.innerHTML = video;
                media.querySelector('.nasa_pict').src = data["url"];
                break;
        }

        //container.querySelector(".nasa_pict").classList.add("concrete");
    }

}

function disableButtonAnimation() {
    //выключение кнопки
    const button = document.querySelector(".search_pict");
    button.classList.remove('active');
}

function setSearchEvent() {
    const button = document.querySelector(".search_pict");

    button.addEventListener("click", (e) => {
        const elem = e.target

        const searchDate = document.querySelector(".search_text").value;

        if (isFormatCorrect(searchDate)) {
            elem.classList.add('active')
            loadDataAsync(searchDate);

            console.log("cработала кнопка " + elem)
        } else {
            error('Дату нужно ввести в формате YYYY.MM.DD');
        }
    })
}

function error(str) {
    alert(str);

    //очистка инпута
    document.querySelector(".search_text").value = "";

    const container = document.querySelector(".search_container");
    container.classList.add("alert");
}

