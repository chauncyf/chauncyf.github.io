function generate_nav() {
    let res = ``;
    let preTag;
    let first = true;

    $("h2, h3").each(function () {
        let curTag = $(this);

        if (curTag.prop("tagName") === 'H2') {
            if (preTag && preTag.prop("tagName") === 'H3') {
                // res += `</nav></div>`;
                res += `</nav>`;
            }

            // <a class="btn-collapse" data-target="#${$(this).prop("id")}-collapse" data-toggle="collapse"
            //             onclick="collapse()">
            //             <i class="fas fa-angle-right"></i>
            //         </a>


            // data-target="#${$(this).prop("id")}-collapse" data-toggle="collapse"
            // res += `<a class="btn-collapse" id="collapse-btn-${$(this).prop("id")}"

            //         onclick="collapse('${$(this).prop("id")}')">
            //             <i class="fas fa-angle-down"></i>
            //         </a>
            // <a class="nav-link" href="#${$(this).prop("id")}">${$(this).text()}</a>`;

            res += `<a class="nav-link mb-1" href="#${$(this).prop("id")}">${$(this).text()}</a>`;

            // res += `<div class="row">
            //             <div class="col-auto p-0">
            //                 <button class="btn" data-target="#${$(this).prop("id")}-collapse" data-toggle="collapse"><i class="fas fa-plus"></i></button>
            //             </div>
            //             <div class="col p-0">
            //                 <a class="nav-link" href="#${$(this).prop("id")}">${$(this).text()}</a>
            //             </div>
            //         </div>
            //         `;
        }
        if (curTag.prop("tagName") === 'H3') {
            if (preTag && preTag.prop("tagName") === 'H2') {
                res += `<nav class="nav nav-pills flex-column collapse show" id="collapse-body-${preTag.prop("id")}"> `;

                // if (first) {
                //     // res += `<div class="collapse show" id="${preTag.prop("id")}-collapse"><nav class="nav nav-pills flex-column"> `;
                //     res += `<nav class="nav nav-pills flex-column collapse show" id="${preTag.prop("id")}-collapse"> `;
                //     first = false;
                // } else {
                //     // res += `<div class="collapse" id="${preTag.prop("id")}-collapse"><nav class="nav nav-pills flex-column"> `;
                //     res += `<nav class="nav nav-pills flex-column collapse" id="${preTag.prop("id")}-collapse"> `;
                // }

            }
            res += `<a class="nav-link ml-3 mb-1" href="#${$(this).prop("id")}">${$(this).text()}</a>`;

        }
        preTag = curTag;
    });

    if (preTag && preTag.prop("tagName") === 'H3') {
        res += `</nav>`;
    }

    $('#navbar-pill').append(res);
}