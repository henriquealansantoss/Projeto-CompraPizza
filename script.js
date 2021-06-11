//criando atalhos para facilitar o uso
let cart = [];
let modalQt = 1;
let modalkey = 0;
let sizePrice = 0;

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

cl('.pizzaInfo--size').forEach((size, sizeIdex) => {
  
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let d = c('.pizzaInfo--size.selected').getAttribute('data-key');

        if (d == 0) {
            sizePrice = pizzaJson[modalkey].price - 5;

        } else if (d == 1) {
            sizePrice = pizzaJson[modalkey].price - 3;

        } else if (d == 2) {
            sizePrice = pizzaJson[modalkey].price;

        }

        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${sizePrice.toFixed(2).replace('.',',')}`;

    });

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

    let identifier = pizzaJson[modalkey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalkey].id,
            size,
            qt: modalQt
        });

    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
   
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;


    if (cart.length > 0) {
        c('aside').classList.add('show');
        //zerar no inicio 
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let v = c('.pizzaInfo--actualPrice').innerText;
            v = parseFloat(v.substr(3,7).replace(',','.'));
            
            
            subtotal += v * cart[i].qt;
            //  subtotal += pizzaItem.price * cart[i].qt;
            

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            //Prof fez com switch, porém o switch não funcionou com o Opera 

            //Em uma das perguntas no chat encontrei =  
            //como meu data-key é uma string devo colocar entre '' ou converter com o parseInt()

            switch(cart[i].size) {
                case '0':
                    pizzaSizeName = 'P';
                   
                    break;
                case '1':
                    pizzaSizeName = 'M';
                   
                    break;
                case '2':
                    pizzaSizeName = 'G';
                   
                    break;
            }

            // if (cart[i].size == 0) {
            //     pizzaSizeName = 'P';
            // } else if (cart[i].size == 1) {
            //     pizzaSizeName = 'M';
            // } else if (cart[i].size == 2) {
            //     pizzaSizeName = 'G';
            // }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();

            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.',',')}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.',',')}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.',',')}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}