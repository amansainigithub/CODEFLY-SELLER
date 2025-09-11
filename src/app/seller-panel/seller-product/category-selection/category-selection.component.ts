import { Component } from '@angular/core';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrl: './category-selection.component.css'
})
export class CategorySelectionComponent {categories = [
    'Men Fashion', 'Women Fashion', 'Home & Living', 
    'Kids & Toys', 'Personal Care & Wellness', 
    'Mobiles & Tablets', 'Consumer Electronics','Bootle'
    ,'Electronic Product','Food Products','Perfume','Clothes',
    'Spare Parts','Plastic Products'
  ];

  subCategories = [
    'Western Wear', 'Accessories', 'Footwear', 
    'Inner & Sleepwear', 'Sports & Activewear', 
    'Women Ethnic Wear', 'Maternity'
  ];

  accessories = [
    'Jewellery', 'Belts', 'Fashion Accessories', 
    'Caps & Hats', 'Hair Accessories', 'Scarves, Stoles & Gloves'
  ];

  hairAccessories = [
    'Hair Buns', 'Hair Bands', 'Gajra/Floral Hair Accessories',
    'Hair Extensions & Wigs', 'Hair Clips & Hair Pins'
  ];

  // Active states (Initially null → kuch bhi select nahi hai)
  activeCategory: string | null = null;
  activeSubCategory: string | null = null;
  activeAccessory: string | null = null;
  activeHairAccessory: string | null = null;

  // Functions
  setActiveCategory(item: string) {
    this.activeCategory = item;
    this.activeSubCategory = null;
    this.activeAccessory = null;
    this.activeHairAccessory = null;
    this.finalCategoryBoxHide();
  }

  setActiveSubCategory(sub: string) {
    this.activeSubCategory = sub;
    this.activeAccessory = null;
    this.activeHairAccessory = null;
    this.finalCategoryBoxHide();
  }

  setActiveAccessory(sub: string) {
    this.activeAccessory = sub;
    this.activeHairAccessory = null;
    this.finalCategoryBoxHide();
  }

  setActiveHairAccessory(sub: string) {
    this.activeHairAccessory = sub;

    this.finalCategoryBoxShow();
  }

finalCategory:any = false;
finalCategoryBoxShow(){
    this.finalCategory = true;
}

finalCategoryBoxHide(){
    this.finalCategory = false;
  
}

}
