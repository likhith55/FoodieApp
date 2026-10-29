import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AppContext } from '../AppContext';
import { CATEGORIES, RECIPES } from '../data';

const INK = '#26352B';
const GREEN = '#315C43';
const ORANGE = '#E66E46';
const PAPER = '#FAF7F1';
const MUTED = '#85877D';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';

export default function HomeScreen({ navigation }) {
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');

  const { favorites, toggleFavorite, myRecipes, deleteRecipe } =
    useContext(AppContext);

  const allRecipes = [...RECIPES, ...myRecipes];
  const tabs = ['All', ...CATEGORIES, 'Favorites', 'My Food'];
  let recipes = allRecipes;

  if (selected === 'Favorites') {
    recipes = allRecipes.filter((item) => favorites.includes(item.id));
  } else if (selected === 'My Food') {
    recipes = myRecipes;
  } else if (selected !== 'All') {
    recipes = allRecipes.filter((item) => item.category === selected);
  }

  recipes = recipes.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const featuredRecipe = recipes[0];

  const confirmDelete = (id) => {
    Alert.alert('Delete recipe?', 'This recipe will be removed from My Food.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRecipe(id),
      },
    ]);
  };

  const openRecipe = (item) =>
    navigation.navigate('Detail', { id: item.id });

  const renderRecipe = ({ item, index }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={[styles.card, index % 2 === 1 && styles.cardRight]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openRecipe(item)}
          accessibilityLabel={`View ${item.name} recipe`}
        >
          <Image
            source={{ uri: item.image || FALLBACK_IMAGE }}
            style={styles.recipeImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(item.id)}
          accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Text style={[styles.heartText, isFavorite && styles.heartActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardInfo}
          activeOpacity={0.85}
          onPress={() => openRecipe(item)}
        >
          <Text style={styles.recipeCategory}>
            {item.category || 'FROM YOUR KITCHEN'}
          </Text>
          <Text style={styles.recipeName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.cardMetaRow}>
            <Text style={styles.recipeMeta}>{item.prepTime || 'Time varies'}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.recipeMeta}>
              {item.difficulty || 'Homemade'}
            </Text>
          </View>
        </TouchableOpacity>

        {selected === 'My Food' && (
          <View style={styles.manageRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('AddRecipe', { recipe: item })}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>YOUR LITTLE CORNER OF THE KITCHEN</Text>
          <Text style={styles.title}>
            What sounds{'\n'}good today?
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => setSelected(selected === 'Favorites' ? 'All' : 'Favorites')}
          accessibilityLabel="Show favorite recipes"
        >
          <Text style={styles.avatarText}>♥</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Find a new favourite, or make an old one.
      </Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search something delicious..."
          placeholderTextColor="#A6A196"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {selected === 'All' && featuredRecipe && !search.trim() ? (
        <View style={styles.featuredSection}>
          <View style={styles.featuredHeading}>
            <Text style={styles.sectionKicker}>A LITTLE INSPIRATION</Text>
            <Text style={styles.featuredCaption}>TODAY'S PICK</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => openRecipe(featuredRecipe)}
          >
            <ImageBackground
              source={{ uri: featuredRecipe.image || FALLBACK_IMAGE }}
              style={styles.featuredCard}
              imageStyle={styles.featuredImage}
            >
              <View style={styles.featuredShade} />
              <View style={styles.featuredContent}>
                <View style={styles.featuredTag}>
                  <Text style={styles.featuredTagText}>
                    {featuredRecipe.category || 'THE GOOD STUFF'}
                  </Text>
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {featuredRecipe.name}
                </Text>
                <View style={styles.featuredBottom}>
                  <Text style={styles.featuredMeta}>
                    ◷  {featuredRecipe.prepTime || 'Made with love'}
                  </Text>
                  <View style={styles.featuredArrow}>
                    <Text style={styles.featuredArrowText}>↗</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.categoryHeader}>
        <View>
          <Text style={styles.sectionTitle}>Browse the menu</Text>
          <Text style={styles.categorySubtitle}>Pick your kind of craving</Text>
        </View>
        {selected === 'My Food' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddRecipe')}
          >
            <Text style={styles.addButtonText}>＋  Add yours</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {tabs.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelected(category)}
            style={[
              styles.categoryChip,
              selected === category && styles.categoryActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selected === category && styles.categoryTextActive,
              ]}
            >
              {category === 'Favorites' ? '♥  ' : ''}
              {category === 'My Food' ? '＋  ' : ''}
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listHeading}>
        <View>
          <Text style={styles.sectionTitle}>
            {selected === 'All'
              ? 'Made for your table'
              : selected === 'Favorites'
                ? 'Your saved recipes'
                : selected === 'My Food'
                  ? 'Your creations'
                  : `${selected}, anyone?`}
          </Text>
          <Text style={styles.resultCount}>
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} to try
          </Text>
        </View>
        <Text style={styles.listDecoration}>✳</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>
        {selected === 'Favorites' ? '♡' : '✳'}
      </Text>
      <Text style={styles.emptyTitle}>Nothing on the menu just yet</Text>
      <Text style={styles.emptyText}>
        {selected === 'Favorites'
          ? 'Tap the heart on a recipe and it will be waiting here.'
          : selected === 'My Food'
            ? 'Add your first recipe and make this kitchen yours.'
            : 'Try a different search or pick another category.'}
      </Text>
      {selected === 'My Food' && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Text style={styles.emptyButtonText}>Create a recipe  ↗</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        key={selected}
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        contentContainerStyle={styles.recipeList}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PAPER },
  recipeList: { paddingHorizontal: 19, paddingBottom: 34 },
  topBar: {
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: ORANGE,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: INK,
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#F3E4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: ORANGE, fontSize: 24 },
  subtitle: { color: MUTED, fontSize: 13, marginTop: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEE8DD',
  },
  searchIcon: { fontSize: 27, color: GREEN, marginRight: 9 },
  searchInput: { flex: 1, color: INK, fontSize: 14 },
  clearSearch: { fontSize: 23, color: MUTED, paddingHorizontal: 4 },
  featuredSection: { marginBottom: 25 },
  featuredHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  sectionKicker: {
    color: INK,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredCaption: {
    color: ORANGE,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  featuredCard: {
    height: 218,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 23,
    backgroundColor: '#D9C6AE',
  },
  featuredImage: { borderRadius: 23 },
  featuredShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 31, 24, 0.32)',
  },
  featuredContent: { padding: 18 },
  featuredTag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#F7E5D6',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featuredTagText: {
    color: '#67432F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '800',
    marginTop: 10,
    maxWidth: '80%',
  },
  featuredBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  featuredMeta: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  featuredArrow: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredArrowText: { color: GREEN, fontSize: 19, fontWeight: '700' },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: INK },
  categorySubtitle: { color: MUTED, fontSize: 11, marginTop: 4 },
  categoryList: { paddingBottom: 22, gap: 8 },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE4D9',
  },
  categoryActive: { backgroundColor: GREEN, borderColor: GREEN },
  categoryText: { color: '#66695F', fontSize: 11, fontWeight: '700' },
  categoryTextActive: { color: '#FFFFFF' },
  addButton: {
    backgroundColor: GREEN,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultCount: { color: MUTED, fontSize: 11, marginTop: 4 },
  listDecoration: { color: ORANGE, fontSize: 22 },
  cardRow: { justifyContent: 'space-between' },
  card: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEAE1',
  },
  cardRight: { marginLeft: 2 },
  recipeImage: { width: '100%', height: 126, backgroundColor: '#EDE3D5' },
  heart: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: { color: '#8E8B83', fontSize: 22, lineHeight: 26 },
  heartActive: { color: ORANGE },
  cardInfo: { paddingHorizontal: 11, paddingTop: 10, paddingBottom: 12 },
  recipeCategory: {
    color: ORANGE,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 5,
  },
  recipeName: { color: INK, fontWeight: '800', fontSize: 13 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  recipeMeta: { color: MUTED, fontSize: 10 },
  metaDot: { color: ORANGE, marginHorizontal: 5 },
  manageRow: {
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#EAF0E8',
    borderRadius: 9,
  },
  editText: { color: GREEN, fontSize: 12, fontWeight: '700' },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FCECE7',
    borderRadius: 9,
  },
  deleteText: { color: '#B65138', fontSize: 12, fontWeight: '700' },
  emptyState: {
    marginTop: 5,
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE8DD',
  },
  emptyEmoji: { color: ORANGE, fontSize: 32, marginBottom: 8 },
  emptyTitle: {
    color: INK,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  emptyButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },
  emptyButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});
