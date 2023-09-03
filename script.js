/*
Необхідно розбити картинку на 16 рівних частин і посмістити їх в блоки. Розбивати картинку на кусочки можна за допомогою background-position
При кліку на кнопку Start game або при перетягуванні пазла на правий блок(використовуємо sortable) має запуститися зворотній відлік. Сама кнопка має заблокуватися.
Якщо час закінчився і ви не встигли скласти пазл має видати повідомлення в модальному вікні: “It's a pity, but you lost”. Кнопка Check result має заблокуватися
При кліку на кнопку Check result має видати повідомлення в модальному вікні: “You still have time, you sure?” з часом який залишився.
При кліку на кнопку Check провіряється чи добре складений пазл, якщо так видає повідомлення: “Woohoo, well done, you did it!” в іншому варіанті “It's a pity, but you lost”. Кнопка Check result має заблокуватися.
При кліку на кнопку Close закриває модальне вікно.
При кліку на кнопку New game скидує час і заново рандомно розставляє пазли. Кнопка Start game має розблокуватися, а кнопка Check result має бути заблокована.
*/

"use strict";
$(function () {
  let time = 60;
  let timer;
  let chose = 1;

  //  sortable puzzle
  $(".puzzle-box").sortable({
    connectWith: ".puzzle-box",
    containment: ".puzzle-game",
    cursor: "move",
    scroll: false,
    delay: 300,
    start: function (event, ui) {
      if (time == 60) {
        $(".btn-start").trigger("click");
      }
    },
    receive: function (event, ui) {
      if ($(this).attr("value") == "fill") {
        chose = 1;
      } else {
        $(this).attr("value", "fill");
        chose = 0;
      }
    },
    stop: function (event, ui) {
      if (chose) {
        $(this).sortable("cancel");
      } else {
        $(this).removeAttr("value");
      }
    },
  });

  // random puzzle (new game)
  puzzleFill();

  // button puzzle
  $(".btn-start").click(() => {
    $(".btn-start").attr("disabled", true);
    $(".btn-result").removeAttr("disabled");
    timer = setInterval(timerStart, 1000);
  });
  $(".btn-result").click(() => {
    modalOpen(1);
  });
  $(".btn-new").click(() => {
    $(".btn-start").removeAttr("disabled");
    $(".countTimer").text("01:00");
    clearInterval(timer);
    time = 60;
    puzzleFill();
    modalClose(2);
    location.reload();
  });
  // button modal
  $(".btn-closeSure").click(() => {
    timer;
    modalClose(1);
  });
  $(".btn-check").click(() => {
    if (gameCheck() == 16) {
      modalChange(1);
    } else {
      modalChange(0);
      $(".btn-start").removeAttr("disabled");
      $(".countTimer").text("01:00");
      clearInterval(timer);
      time = 60;
      puzzleFill();
    }
  });
  $(".btn-closeLose").click(() => modalClose(2));
  $(".btn-closeWin").click(() => modalClose(3));

  // functions puzzleFill()
  function puzzleFill() {
    let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let position;
    for (let i = 0; i < 16; i++) {
      $(".puzzle-pieces>.puzzle-box").attr("value", "fill");
      $(".puzzle-image>.puzzle-box").removeAttr("value");
      do {
        position = Math.round(Math.random() * 15);
      } while (check[position]);
      $(`.piece:eq(${i})`).attr("value", `${position + 1}`);
      $(`.puzzle-pieces>.puzzle-box:eq(${i})`).append($(`.piece:eq(${i})`));
      check[position] = 1;
    }
    $(".piece").css("background-image", "url(image/cute_cat.jpg)");
  }
  // timerStart()
  function timerStart() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    $(".countTimer").text(`${minutes}:${seconds}`);
    $(".modal-sure > p").text(
      `You still have time, you sure? ${minutes}:${seconds}`
    );
    time--;
    if (!time) {
      clearInterval(timer);
      if (gameCheck() == 16) {
        modalOpen(3);
      } else {
        modalOpen(2);
      }
    }
  }
  // gameCheck()
  function gameCheck() {
    let checkResult = 0;
    for (let i = 0; i < 16; i++) {
      if (
        $(`.puzzle-image>.puzzle-box:eq(${i})>.piece`).attr("value") ==
        i + 1
      ) {
        checkResult++;
      }
    }
    $(".btn-result").attr("disabled", true);
    return checkResult;
  }

  // modal show & hide
  function modalOpen(num) {
    let alert =
      num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
    $(".modal").fadeIn(300);
    $(`${alert}`).show();
  }
  function modalChange(num) {
    $(".modal-sure").hide();
    num == 1 ? $(".modal-win").show() : $(".modal-lose").show();
  }
  function modalClose(num) {
    let alert =
      num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
    $(".modal").fadeOut(300);
  }
});
