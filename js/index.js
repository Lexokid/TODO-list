$.ajax({
  type: 'GET',
  crossDomain: true,
  url: 'https://raw.githubusercontent.com/Lexokid/TODO-list/gh-pages/README.md',
  beforeSend: function () {}
}).done(function (res) {
  function sort(arr) {
    var l1, l2
    var arr2 = []
    for (var i = 0; i < arr.length; i++) {
      switch (arr[i].indent) {
        case 0:
          l1 = arr2.push(arr[i])
          break;
        case 1:
          l2 = arr2[l1 - 1].sub.push(arr[i])
          break;
        case 2:
          arr2[l1 - 1].sub[l2 - 1].sub.push(arr[i])
      }
    }
    return arr2;
  }

  function convertToObj(str) {
    var reg = /(\s*)\- \[(.*)\]\s+(?:(?:\[(.+)\]\((.+)\))|(.+))/g
    var obj = {
      'name': '',
      'isComplete': false,
      'link': '',
      'indent': 0,
      'sub': []
    }
    str.replace(reg, function (match, p1, p2, p3, p4, p5) {
      var blank = p1.split(' ').length - 1
      obj.indent = blank / 4
      if (p2.toLowerCase() === 'x') {
        obj.isComplete = true
      }
      if (!p5) {
        obj.name = p3
        obj.link = p4
      } else {
        obj.name = p5
      }
    })
    return obj;
  }

  function stitching(sum, val) {
    var str = '<li>' +
      '<a' + (val.link ? (' data-href=' + val.link) : '') + ' title="' + val.name + '">' +
      val.name +
      (val.isComplete ? '<i class="demo-icon icon-ok">&#xe802;</i>' : '') +
      (val.link ? '<i class="demo-icon icon-link">&#xe801;</i>' : '') +
      '</a>' +
      (val.sub.length > 0 ?
        ('<ul class="submenu">' +
          val.sub.reduce(stitching, '') +
          '</ul>') : '') +
      '</li>'
    return sum + str
  }

  var reg = /^\s*- \[(.*)\]\s+.*/gm
  var array
  var TODO = []

  while ((array = reg.exec(res)) !== null) {
    TODO.push(array[0])
  }

  TODO = sort(TODO.map(convertToObj))

  var html = ''

  html = TODO.reduce(stitching, '')

  // 插入拼接好的html
  $('#demo-list').html(html)
  // 初始化滑动菜单
  $("#jquery-accordion-menu").jqueryAccordionMenu();
  // 初始化滚动条
  $('#demo-list').mCustomScrollbar({
    theme: 'minimal',
  });
  // 绑定链接
  $('.demo-icon.icon-link').on('click', function (e) {
    e.stopPropagation()
    window.open($(this).parent().attr('data-href'))
  })

  $('#loading').fadeOut(200);
}).fail(function () {
  alert('error')
})

$(function () {
  // 重写:Contains选择器，实现忽略大小写
  $.expr[":"].Contains = function (a, i, m) {
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };
  !(function filterList(header, list, input) {
    $(input).keyup(function () {
      var filter = $(this).val().toLowerCase().trim();
      if (filter) {
        $matches = $(list).find("a:Contains(" + filter + ")").parent();
        $("li", list).not($matches).slideUp();
        $matches.slideDown();
      } else {
        $(list).find("li").slideDown();
      }
      return false;
    })
  })('#form', '#demo-list', '#filterinput');
})
