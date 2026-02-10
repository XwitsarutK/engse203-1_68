// เริ่มทำงานเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // ดึง element ต่างๆ มาเก็บในตัวแปร
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('searchInput');
    const loader = document.getElementById('loader');
    let allProducts = []; // เก็บข้อมูลสินค้าทั้งหมด

    // แสดง loader ระหว่างโหลดข้อมูล
    loader.style.display = 'block';

    // ดึงข้อมูลสินค้าจากไฟล์ JSON
    fetch('js/products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data; // เก็บข้อมูลสินค้า
            displayProducts(allProducts); // แสดงสินค้าทั้งหมด
            // ซ่อน loader เมื่อโหลดข้อมูลเสร็จ
            loader.style.display = 'none';
        })
        .catch(error => {
            // จัดการกรณีเกิด error ในการโหลดข้อมูล
            console.error('Error loading products:', error);
            loader.textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        });

    // ฟังก์ชันจัดรูปแบบราคาให้มี comma คั่นหลักพัน
    // เช่น 12600 จะกลายเป็น 12,600
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // ฟังก์ชันแสดงสินค้าบนหน้าเว็บ
    function displayProducts(products) {
        productList.innerHTML = ''; // ล้างรายการเดิมก่อน
        products.forEach(product => {
            // สร้าง card สำหรับแต่ละสินค้า
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>ราคา: ${formatPrice(product.price)} บาท</p>
            `;
            productList.appendChild(card); // เพิ่ม card เข้าไปในรายการ
        });
    }

    // Improved Search with validation
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Validation: If search is empty, show all products
        if (searchTerm === '') {
            displayProducts(allProducts);
            return;
        }

        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm);
        });
        displayProducts(filteredProducts); // แสดงเฉพาะสินค้าที่กรองแล้ว
    });
});