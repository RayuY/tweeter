$(() => {

  $('.tweet-text').on("input", onInput);

});


const onInput = function () {
  const $input = $(this);
  const text = $input.val();
  
  let $counter = $(this).parent().find(".counter");
  
  const remaining = 140 - text.length;
  
  if (remaining < 0) {
    $($counter).addClass("counter-red");
  } else {
    $($counter).removeClass("counter-red");
  }

  $counter.text(remaining)

};

