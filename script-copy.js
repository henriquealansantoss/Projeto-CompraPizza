//criando atalhos para facilitar o uso
let cart = [];
let modalQt = 1;
let modalkey = 0;

const c = (el) => document.querySelector(el);
const cl = (el) => document.querySelectorAll(el);


//Listagem das Pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);



    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',')}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento de click para abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalkey = key;


        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.',',')}`;

        /**
         * para a seleção continuar no grande
         * retiro a seleção de tdos e reseto para selecionar o grande sempre que iniciar*...
         */
        c('.pizzaInfo--size.selected').classList.remove('selected');

        cl('.pizzaInfo--size').forEach((size, sizeIndex) => {

            //*inicio
            if (sizeIndex == 2) {
                size.classList.add('selected');
            };

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];


        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    c('.pizza-area').append(pizzaItem);
});

//Eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

//evento click nos botões de cancelamento
cl('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);

});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cl('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let d = c('.pizzaInfo--size.selected');

    });


    c('.pizzaInfo--addButton').addEventListener('click', () => {
        // //qual pizza
        // console.log(modalkey);
        // //qual o tamanho
        // let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
        // console.log(size);
        // //quantas pizzas
        // console.log(modalQt);

        let size = c('.pizzaInfo--size.selected').getAttribute('data-key');

        cart.push({
            id: pizzaJson[modalkey].id,
            size,
            qt: modalQt
        });

        closeModal();
    });

});