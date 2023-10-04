const { promises: fs } = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        const products = await this.getProducts();
        if (products.some((p) => p.code === code)) {
            console.log(`Ya se encuentra agregado el código: ${code}`);
        } else {
            const id = this.creoID();
            const newProduct = { id, title, description, price, thumbnail, code, stock };
            products.push(newProduct);
            await this.saveProducts(products);
        }
    }

    creoID = () => parseInt(Math.random() * 100000);

    async getProducts() {
        return await getJSONFromFile(this.path);
    }
    
    deleteProductsFile = () => deleteJSONToFile(this.path);

    async deleteProduct(id) {
        const products = await this.getProducts();
        let index = products.findIndex((p) => p.id === id)
        if (index > -1) {
            products.splice(index, 1)
            await this.saveProducts(products);
            console.log("Se ha borrado correctamente el producto ");
        } else {
            console.log('No se ha podido borrar el producto');
        }
    }

    async getProdcutById(id) {
        const products = await this.getProducts(); 
        let productById = products.find(p => p.id === id);
        if (!productById) {
            console.log("Producto NO encontrado");
        } else {
            console.log("Producto encontrado", productById);
        }
    }
    
    
    async updateProduct(id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) {
        const getProducts = await this.getProducts(); // Use this.getProducts() instead of getJSONFromFile
        let ProdId = getProducts.some(p => p.id === id);
        if (!ProdId) {
            console.log(`Actualizacion del producto: producto no encontrado, id: ${id}`);
        } else {
            const products = { id: id, title: newTitle, description: newDescription, price: newPrice, thumbnail: newThumbnail, code: newCode, stock: newStock };
            await this.saveJSONToFile(this.path, products); // Use this.saveJSONToFile
            console.log("Producto actualizado exitosamente", products);
        }
    }
    

    async saveProducts(products) {
        await saveJSONToFile(this.path, products);
    }
}

const getJSONFromFile = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        return [];
    }
    const content = await fs.readFile(path, 'utf-8');
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
}

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t'); 
    try {
        await fs.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
}

const deleteJSONToFile = async (path)=> {
    try {
        console.log('Intentando borrar el archivo...')
        await fs.unlink(path);
        console.log('Finalizó el borrado del archivo.')
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser borrado.`);
    }      
}

module.exports = ProductManager;

const desafio = async () => {
    try {
        const productManager = new ProductManager("./products.json");
        
        const products = await productManager.getProducts();
        console.log("getProducts", 'Aquí los productos:', products);
        
    } catch (error) {
        console.error('Ha ocurrido un error: ', error.message);
    }
};
desafio()

