$.fn.generateNav = function () {
    let res = ``;
    let preTag;

    $('.navbar-brand.nav-link').prop('href', `#${$('h1').first().prop('id')}`);

    $('h2, h3').each(function () {
        let curTag = $(this);

        if (curTag.prop('tagName') === 'H2') {
            if (preTag && preTag.prop('tagName') === 'H3') {
                res += `</nav>`;
            }
            res += `<a class="nav-link nav-link-parent mb-1" href="#${$(this).prop('id')}">${$(this).text()}</a>`;
        } else if (curTag.prop('tagName') === 'H3') {
            if (preTag && preTag.prop('tagName') === 'H2') {
                res += `<nav class="nav nav-pills flex-column nav-pills-collapse">`;
            }
            res += `<a class="nav-link ml-3 mb-1" href="#${$(this).prop('id')}">${$(this).text()}</a>`;
        }

        preTag = curTag;
    });

    if (preTag && preTag.prop('tagName') === 'H3') {
        res += `</nav>`;
    }

    $(this).append(res);

    $('.nav-link-parent').not('.active').next('.nav-pills-collapse').hide();
    updateNav();
    scrollToNav();
};

function updateNav() {
    $(window).on('activate.bs.scrollspy', function (e, obj) {
        $('.nav-link-parent').not('.active').next('.nav-pills-collapse').slideUp(300);
        let cur = $(`a[href*="${obj.relatedTarget}"]`);
        if (cur.hasClass('nav-link-parent')) {
            cur.next('.nav-pills-collapse').slideDown(300);
        } else {
            if (!cur.parent().hasClass('active')) {
                cur.parent().slideDown(300)
            }
        }
    });
}

function scrollToNav() {
    let active = $('.nav-link.active').last();
    if (active.length > 0) {
        active[0].scrollIntoView({
            block: 'center',
            behavior: 'smooth'
        });
    }
}