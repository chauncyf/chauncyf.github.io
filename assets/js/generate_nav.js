(function () {
    let res = ``;
    let preTag;

    $("h2, h3").each(function () {
        let curTag = $(this);

        if (curTag.prop("tagName") === 'H2') {
            if (preTag && preTag.prop("tagName") === 'H3') {
                res += `</nav>`;
            }
            res += `<a class="nav-link mb-1" href="#${$(this).prop("id")}">${$(this).text()}</a>`;
        } else if (curTag.prop("tagName") === 'H3') {
            if (preTag && preTag.prop("tagName") === 'H2') {
                res += `<nav class="nav nav-pills flex-column nav-pills-collapse">`;
            }
            res += `<a class="nav-link ml-3 mb-1" href="#${$(this).prop("id")}">${$(this).text()}</a>`;
        }

        preTag = curTag;
    });

    if (preTag && preTag.prop("tagName") === 'H3') {
        res += `</nav>`;
    }

    $('#navbar-pill').append(res);
}());