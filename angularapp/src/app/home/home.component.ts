import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthModel } from '../auth-model';
import { Recipe } from '../recipe/recipe';
import { RecipeSaver } from '../recipe/recipe-saver';
import { RecipeViewType, RecipeEnum } from '../recipe/recipe-view-type';
import { RecipeService } from '../recipe/recipe.service';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // test: AuthModel;
  recipeList: Recipe[];
  girdStyle = RecipeEnum.search
  testOnly: Recipe[];
  searchString: string;
  sortSubject: Subject<boolean> = new Subject();
  sortBool: boolean = false;
  maxPerPage: number = 5;
  paginationList: any[] = [];
  pagesRecipes: any[] = [];
  currentPage: number = 1;

  constructor(private service: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.sortSubject.next(false);
    this.sortSubject.subscribe(val => {
      if (val)
        this.sortByPopularity();
      else
        this.sortByDefault();
      this.sortBool = val;
    })
    this.getAllRecipes();
  }

  getAllRecipes() {
    console.log("in get all recipes");
    this.service.getAllRecipes().subscribe((reply) => {
      console.log(reply);
      this.recipeList = reply;
      this.testOnly = this.recipeList;
      this.preparePagination();
      // this.fillTest();
      take(1);
    });
  }

  preparePagination() {
    if (this.testOnly.length > this.maxPerPage) {
      let pagnum = Math.ceil(this.testOnly.length / 5);
      this.paginationList = Array(2).fill(0).map((_, i) => 1 + i);
      for (let index = 0; index < this.paginationList.length; index++) {
        const page = this.paginationList[index];
        const start = index * this.maxPerPage;
        if (index == this.paginationList.length - 1)
          this.pagesRecipes.push(Array(this.testOnly.length % this.maxPerPage).fill(0).map((_, x) => this.testOnly[x + (index * this.maxPerPage)]));
        else
          this.pagesRecipes.push(Array(this.maxPerPage).fill(0).map((_, x) => this.testOnly[x + (index * this.maxPerPage)]));
      }
      console.log(this.paginationList);
      console.log(this.pagesRecipes);
    }
  }

  goToPage(i: number) {
    this.currentPage = i;
  }

  getCurrentRecipes(): Recipe[] {
    return this.pagesRecipes[this.currentPage - 1];
  }

  isPage(i: number): boolean {
    console.log("i: " + i);
    console.log("curr " + this.currentPage);
    return i == this.currentPage;
  }

  toggleSort() {
    let s = !this.sortBool;
    this.sortSubject.next(s);
  }

  sortByPopularity() {
    this.testOnly = this.testOnly.sort((b, a) => a.numTimesPrepared - b.numTimesPrepared);
  }

  sortByDefault() {
    this.testOnly = this.testOnly.sort((a, b) => a.recipeId - b.recipeId);
  }


  getRecipeImageStyle(recipe: Recipe): Object {
    return {
      background:
        'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(' + recipe.recipeImage + ') no-repeat center',
      "background-size": "cover"
    };
  }

  fillTest() {
    // this.testOnly = this.recipeList;
    this.testOnly = Array(10).fill(this.recipeList[0]).map((x, i) => {
      let r = new Recipe();
      r.recipeName = x.recipeName + i;
      r.recipeId = x.recipeId;
      r.numTimesPrepared = x.numTimesPrepared;
      r.tags = x.tags;
      r.recipeImage = x.recipeImage;
      r.ingredients = x.ingredients
      return r;
    });
    this.testOnly = this.testOnly.concat(Array(5).fill(this.recipeList[1]).map((x, i) => {
      let r = new Recipe();
      r.recipeName = x.recipeName + i;
      r.recipeId = x.recipeId;
      r.numTimesPrepared = x.numTimesPrepared;
      r.tags = x.tags;
      r.recipeImage = x.recipeImage;
      r.ingredients = x.ingredients
      return r;
    }));
    this.testOnly = this.testOnly.concat(Array(5).fill(this.recipeList[2]).map((x, i) => {
      let r = new Recipe();
      r.recipeName = x.recipeName + i;
      r.recipeId = x.recipeId;
      r.numTimesPrepared = x.numTimesPrepared;
      r.tags = x.tags;
      r.recipeImage = x.recipeImage;
      r.ingredients = x.ingredients
      return r;
    }));
    this.testOnly = this.testOnly.concat(Array(5).fill(this.recipeList[3]).map((x, i) => {
      let r = new Recipe();
      r.recipeName = x.recipeName + i;
      r.recipeId = x.recipeId;
      r.numTimesPrepared = x.numTimesPrepared;
      r.tags = x.tags;
      r.recipeImage = x.recipeImage;
      r.ingredients = x.ingredients
      return r;
    }));
    console.log("this.testOnly");
    console.log(this.testOnly);
  }

  goToDetail(recipe: Recipe) {
    this.router.navigate([`recipeDetail/${+recipe.recipeId}`]);
  }

  withinSearch(recipe: Recipe): boolean {
    if (!this.searchString) return true;
    if (this.searchString.trim().length <= 0) return true;
    console.log(this.searchString);
    if (recipe.recipeName.toLowerCase().includes(this.searchString.toLowerCase())) {
      console.log(recipe.recipeName);
      return true;
    }
    if (recipe.recipeAuthor)
      if (recipe.recipeAuthor.toLowerCase().includes(this.searchString.toLowerCase())) {
        console.log(recipe.recipeAuthor);
        return true;
      }
    if (recipe.tags.some(tag => tag.tagName.toLowerCase().includes(this.searchString.toLowerCase()))) {
      console.log(recipe.tags);
      return true;
    }
    if (recipe.ingredients.some(ing => ing.ingredientName.toLowerCase().includes(this.searchString.toLowerCase()))) {
      console.log(recipe.ingredients);
      return true;
    }
    return false;
  }
}

