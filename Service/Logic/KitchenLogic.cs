using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository.Models;

namespace Service.Logic
{
    public class KitchenLogic : ILogicKitchen
    {
        private InTheKitchenDBContext _context;
        public KitchenLogic(InTheKitchenDBContext _context)
        {
            this._context = _context;
        }

        public  List<Recipe> getAllRecipeByRecipeName(string recipeName)
        {
            if (!existRecipeName(recipeName))
            {
                return new List<Recipe>() { };
            }

            return  _context.Recipes
                .Where(r => r.RecipeName == recipeName).ToList();
        }

        public async Task<Recipe> addNewRecipe(Recipe recipe)
        {
            foreach (var rec in await getAllRecipe())
            {
                if (recipe == rec)
                {
                    throw new Exception("recipe already exists ");
                }
            }
            recipe.RecipeId = getAllRecipe().Result.Count() + 1;
            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
            return recipe;
        }

        public async Task<List<Recipe>> getAllRecipeByTags(string tag)
        {
            var tagg = new Tag();
            tagg = _context.Tags.FirstOrDefault(t => t.TagName == tag);
            int tagId = tagg.TagId;

            if (!await existTag(tag))
            {
                return await _context.Recipes.ToListAsync();
            }

            // NOT SURE IF IT WORKS 
            return await _context.Recipes.FromSqlRaw($"SELECT * FROM Recipes WHERE RecipeId IN (SELECT RecipeId FROM RecipeTags WHERE TagId = {tagId})").ToListAsync();
        }

        public async Task<bool> existTag(string name)
        {
            List<Tag> tags = await _context.Tags.ToListAsync();

            return tags.Contains(await getOneTag(name));
        }

        public async Task<Tag> getOneTag(string tagName)
        {
            var tag = await  _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
            if (tag == null)
            {
                return null;
            }
            return tag;
                
        }
        public  bool existRecipeName(string recipeName)
        {
            var recipe = _context.Recipes.FirstOrDefault(r => r.RecipeName == recipeName);

            if (recipe == null)
            {
                return false;
            }
            return true;
        }

        public async Task<List<Recipe>> getAllRecipe()
        {
            return await _context.Recipes.ToListAsync();
        }
    }
}