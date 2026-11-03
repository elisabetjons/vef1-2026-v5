import { el, empty } from './elements.js';
/**
 * Býr til nýjan MealSearcher.
 * @param {MealApi} api Api sem nær í uppskriftir.
 * @param {HTMLElement} baseElement HTML element sem birtir efnið.
 */
export class MealSearcher {
  /* TODO útfæra rest */
  constructor(api, baseElement) {
    this.api = api;
    this.baseElement = baseElement;
  }

  /**
   * Birtir annaðhvort leitarform eða ákveðna uppskrift.
   * @param {string|null} id ID uppskriftar, ef ekki null er hún birt.
   * @returns {Promise<void>} Promise sem klárast þegar uppskrift er birt.
   */
  async render(id = null) {
    /* TODO útfæra */
    if (id === null) {

  // input reitur
      const input = el('input', {
        type: 'text', 
        placeholder: 'Sláðu inn uppskrift',
        name: 'query',
      });
  // leitartakki 
      const button = el('button', {}, 'Leita'); 

      const form = el('form', {
        submit: async (event) => {
          event.preventDefault();
          const query = input.value.trim();
          // ef leitað er án leitarorðs
          if (!query) {
            empty(this.baseElement);
            
            const message = el('p', {}, 'Vantar leitarorð');
            this.baseElement.appendChild(message);
            return;
          }

          // leitarskilaboð
          empty(this.baseElement); 
          
          const loadingMessage = el('p', {}, 'Leitar að uppskriftum...'); 
          this.baseElement.appendChild(loadingMessage);

          // villumeldingar
          try {
            const result = await this.api.search(query);
            this.renderMeals(result.meals);
          } catch (error) {
            empty(this.baseElement);

            const message = el('p', {}, 'Ekki tókst að sækja uppskriftir.');
            this.baseElement.appendChild(message);
            console.error(error);
          }
                  
        },
      }, input, button);
      this.baseElement.appendChild(form);
    } else {
      try {
        const result = await this.api.lookup(id);
        this.renderRecipe(result.meals[0]);
      } catch (error) {
        empty(this.baseElement); 

        const message = el('p', {}, 'Ekki tókst að sækja uppskriftir.');
        this.baseElement.appendChild(message);
        console.error(error);
      }
    }
  }

  /**
   * Birtir alla uppskriftina þegar ýtt er á mynd/titil.
   * @param {object} recipe Uppskrifin sem á að birta.
   */
  renderRecipe(recipe) {
    empty(this.baseElement);

    // til baka takki 
    const backLink = el('a', {
      href: '/', 
      style: `
        display: inline; 
        width: fit-content;
        padding: 5px 10px;
        color: black;
        background-color: #ffb347; 
        text-decoration: none; 
        border-radius: 5px; 
        margin-bottom: 15px;
      `,
    }, 'Til baka');

    this.baseElement.appendChild(backLink);

    // mynd og nafn á réttinum
    const heading = el('h2', {}, recipe.strMeal);
    const image = el('img', {
      src: recipe.strMealThumb, 
      alt: recipe.strMeal, 
      width: '300',
    });
    this.baseElement.appendChild(heading); 
    this.baseElement.appendChild(image);

    // hráefni og mælieiningar birt
    const ingredients = recipe.ingredients;

    const ingredientsList = el('ul', {}); 

    for (const item of ingredients) {
      const listItem = el(
        'li', 
        {}, 
        `${item.measure} ${item.ingredient}`,
      );

      ingredientsList.appendChild(listItem);
    }
    this.baseElement.appendChild(ingredientsList);


    // leiðbeiningar f. uppskrift 
    const instructions = el('p', {}, recipe.strInstructions);
    this.baseElement.appendChild(instructions);
  }
 
  /**
   * Birtir lista af uppskriftum á vefsíðunni 
   * @param {Meal[]} meals Listi af uppskrifum.
   */
  renderMeals(meals) {
    empty(this.baseElement); 

    if (!meals || meals.length === 0) {
      const message = el('p', {}, 'Engin uppskrift fannst');
      this.baseElement.appendChild(message);
      return;
    }

    const heading = el('h2', {}, 'Leitarniðurstöður');
    this.baseElement.appendChild(heading);

  // fer í gegnum hverja uppskrift í listanum
    for(const meal of meals) {
      const title = el('h3', {}, meal.strMeal);

      const image = el('img', {
        src: meal.strMealThumb, 
        alt: meal.strMeal,
        width: '200',
      });

      const article = el('article', {
        click: () => {
          console.log('Smellt á uppskrift:', meal.idMeal);
          window.location.search = `?id=${meal.idMeal}`;
      }, 
    }, title, image); 

    this.baseElement.appendChild(article);
    }
  }

  }

