
import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { AppContext } from '../AppContext';
import { RECIPES } from '../data';

const GREEN = '#315C43';

export default function DetailScreen({ navigation, route }) {
  const { myRecipes, favorites, toggleFavorite } = useContext(AppContext);
  const id = route.params?.id;

  const recipe = [...RECIPES, ...myRecipes].find(
    (item) => String(item.id) === String(id)
  );

  if (!recipe) {
    return (
      <SafeAreaView style={styles.screen}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Recipe not found</Text>
          <Text style={styles.notFoundText}>
            This recipe may have been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(recipe.id);
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [];

  const imageUri =
    recipe.image ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(recipe.id)}
            accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>
            {recipe.category || 'YOUR FOODIE RECIPE'}
          </Text>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.subtitle}>
            A delicious recipe to make and enjoy at home.
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>PREP TIME</Text>
              <Text style={styles.statValue}>
                {recipe.prepTime || '—'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>SERVINGS</Text>
              <Text style={styles.statValue}>
                {recipe.servings ?? '—'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>CALORIES</Text>
              <Text style={styles.statValue}>
                {recipe.calories ?? '—'}
              </Text>
            </View>
          </View>

          {recipe.difficulty ? (
            <View style={styles.difficulty}>
              <Text style={styles.difficultyLabel}>Difficulty</Text>
              <Text style={styles.difficultyValue}>
                {recipe.difficulty}
              </Text>
            </View>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.sectionCount}>
              {ingredients.length} items
            </Text>
          </View>

          <View style={styles.ingredientsCard}>
            {ingredients.length ? (
              ingredients.map((ingredient, index) => (
                <View key={`${index}-${ingredient}`} style={styles.ingredientRow}>
                  <View style={styles.bullet}>
                    <Text style={styles.bulletText}>✓</Text>
                  </View>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No ingredients added yet.</Text>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cooking instructions</Text>
            <Text style={styles.sectionCount}>
              {instructions.length} steps
            </Text>
          </View>

          {instructions.length ? (
            instructions.map((step, index) => (
              <View key={`${index}-${step}`} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepHeading}>Step {index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No cooking instructions added yet.
            </Text>
          )}

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => toggleFavorite(recipe.id)}
          >
            <Text style={styles.bottomButtonText}>
              {isFavorite ? '♥  Remove from favourites' : '♡  Save to favourites'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Enjoy cooking with Foodie.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F1' },
  hero: { height: 310, backgroundColor: '#EDE3D5' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: 17,
    left: 18,
    minWidth: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FAF7F1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backText: { color: GREEN, fontSize: 30, lineHeight: 34 },
  favoriteButton: {
    position: 'absolute',
    top: 17,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: { color: '#E66E46', fontSize: 27 },
  content: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 35 },
  eyebrow: { color: '#E66E46', fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: '#26352B', fontSize: 29, lineHeight: 36, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#85877D', fontSize: 13, lineHeight: 20, marginTop: 8 },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingVertical: 17,
    paddingHorizontal: 8,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#EEE8DD',
  },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#85877D', fontSize: 9, fontWeight: '700', letterSpacing: 0.7 },
  statValue: {
    color: '#26352B',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 7,
    textAlign: 'center',
  },
  statDivider: { width: 1, backgroundColor: '#EEE8DD' },
  difficulty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3E4D8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 11,
  },
  difficultyLabel: { color: '#6E685D', fontSize: 12 },
  difficultyValue: { color: '#B65738', fontSize: 12, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 27,
    marginBottom: 13,
  },
  sectionTitle: { color: '#26352B', fontSize: 18, fontWeight: '800' },
  sectionCount: { color: GREEN, fontSize: 11, fontWeight: '700' },
  ingredientsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE8DD',
  },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EAF0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  bulletText: { color: GREEN, fontWeight: '800', fontSize: 12 },
  ingredientText: { flex: 1, color: '#465247', fontSize: 13, lineHeight: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EAF0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: { color: GREEN, fontSize: 14, fontWeight: '800' },
  stepContent: { flex: 1, paddingTop: 2 },
  stepHeading: { color: '#26352B', fontSize: 13, fontWeight: '800', marginBottom: 5 },
  stepText: { color: '#6E756B', fontSize: 13, lineHeight: 21 },
  emptyText: { color: '#85877D', fontSize: 13, paddingVertical: 8 },
  bottomButton: {
    backgroundColor: GREEN,
    minHeight: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  bottomButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  footer: { color: '#85877D', textAlign: 'center', fontSize: 11, marginTop: 18 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 25 },
  notFoundTitle: { color: '#26352B', fontSize: 21, fontWeight: '800' },
  notFoundText: { color: '#85877D', fontSize: 13, marginTop: 8 },
});
