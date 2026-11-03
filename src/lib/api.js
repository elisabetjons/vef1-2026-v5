import { sleep, error } from './helpers.js';

/** Hámarksfjöldi hráefna í svari frá API. */
const MAX_INGREDIENTS = 20;

/* TODO útfæra rest */
export class MealApi {
  /**
   * @param {string} baseUrl API base url.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Leitar að uppskrift eftir leitarorði. 
   * @param {string} query Leitarorð.
   * @returns {Promise<{meals: object[] | null}>} Leitarniðurstöður frá API.
   */

  async search(query) {
    /* TODO útfæra */
    // ef notandi slær inn slow
    if (query.toLowerCase().includes('slow')){
      await sleep(3); 
    }
    // ef notandi slær inn error
    if (query.toLowerCase().includes('error')) {
      error('Villa við innslátt'); 
    }
    // býr ttil slóð og sækir gögn
    const url = `${this.baseUrl}search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url); 

    if (!response.ok){
      throw new Error(`Tókst ekki að sækja gögn: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data ||
      (data.meals !== null && !Array.isArray(data.meals))
    ) {
      throw new Error('Gögn frá API eru á röngu formi');
    }
    return data;
  }


  /**
   * Skilar uppskrift eftir auðkenni.
   * @param {string} id Uppskriftar id. 
   * @returns {Promise<object>} Gögn API með uppskrift og hráefnalista. 
   */

  async lookup(id) {
    const url = `${this.baseUrl}lookup.php?i=${encodeURIComponent(id)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Tókst ekki að sækja uppskrift');
    }

    const data = await response.json();

    // staðfestum að API innihaldi uppskrift
    if (!data || !Array.isArray(data.meals) || !data.meals[0]) {
      throw new Error('Engin uppskrift fannst');
    }

    const recipe = data.meals[0];
    // ath hvort api sé á réttu formi 
    if (
      typeof recipe.strMeal !== 'string' ||
      typeof recipe.strMealThumb != 'string' ||
      typeof recipe.strInstructions != 'string' 
    ) {
      throw new Error('Uppskrift er á röngu formi.');
    }
    
    const ingredients = [];

    // hráefni og mælieiningar sameinað í einn lista
    for (let i = 1; i <= MAX_INGREDIENTS; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (typeof ingredient === 'string' && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: typeof measure === 'string' ? measure.trim() : '',
        });
      }
    }

    recipe.ingredients = ingredients;

    return data;
  }
}