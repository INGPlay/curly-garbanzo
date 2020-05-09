const A = {
  setColor:function(color){
    const aList = document.querySelectorAll('a');

    // for (let i = 0; i < aList.length; i++){
    //   aList[i].style.color = color;
    // }

    $('a').css("color", color);
  }
}

function nightDayHandler(self){
  const bodySelector = document.querySelector('body');
  switch (self.value)
  {
    case 'Night':
      bodySelector.style.color = 'white';
      bodySelector.style.backgroundColor = 'black';
      self.value = 'Day';

      A.setColor('powderblue');
      break;
    case 'Day':
      bodySelector.style.color = 'black';
      bodySelector.style.backgroundColor = 'white';
      self.value = 'Night';

      A.setColor('black');
      break;
    default:
      alert('Exception');
      break;
  }
}
