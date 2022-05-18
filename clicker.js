function setSearchClickEvent() {
    const textInput = document.querySelector(".search_text");
    const container = document.querySelector(".search_container");

    //когда юзер полезет исправить ошибку
    textInput.addEventListener("click", (e) => {
        container.classList.add('usual');
        container.classList.remove('alert');
    })
}


setSearchClickEvent()