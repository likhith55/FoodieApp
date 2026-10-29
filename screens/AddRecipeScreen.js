
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../AppContext';

const GREEN = '#315C43';

export default function AddRecipeScreen({ navigation, route }) {
  const editing = route.params?.recipe;
  const { addRecipe, updateRecipe } = useContext(AppContext);

  const [name, setName] = useState(editing?.name || '');
  const [image, setImage] = useState(editing?.image || '');
  const [ingredients, setIngredients] = useState(
    editing?.ingredients?.join('\n') || ''
  );
  const [steps, setSteps] = useState(
    editing?.instructions?.join('\n') || ''
  );

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Photo permission needed',
            'Please allow photo library access to choose a recipe image.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Unable to open photos', 'Please try again.');
    }
  };

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Recipe name required', 'Please enter a recipe name.');
      return;
    }

    const ingredientList = ingredients
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const instructionList = steps
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean);

    if (ingredientList.length === 0 || instructionList.length === 0) {
      Alert.alert(
        'Complete your recipe',
        'Please add at least one ingredient and one cooking step.'
      );
      return;
    }

    const recipe = {
      ...(editing || {}),
      id: editing?.id || Date.now().toString(),
      name: name.trim(),
      image,
      ingredients: ingredientList,
      instructions: instructionList,
    };

    if (editing) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {editing ? 'Edit Recipe' : 'Create Recipe'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {editing ? 'Update your creation' : 'Share something delicious'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>YOUR KITCHEN, YOUR RULES</Text>
          <Text style={styles.title}>
            {editing ? 'Perfect your recipe.' : 'What are we cooking?'}
          </Text>
          <Text style={styles.subtitle}>
            Add the details so anyone can recreate your dish.
          </Text>
        </View>

        <Text style={styles.label}>Recipe name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Creamy mushroom pasta"
          placeholderTextColor="#97A39A"
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        <Text style={styles.label}>Recipe photo</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>+</Text>
              </View>
              <Text style={styles.uploadTitle}>Add a delicious photo</Text>
              <Text style={styles.uploadSubtitle}>
                Choose an image from your device
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {image ? (
          <TouchableOpacity onPress={pickImage} style={styles.changeImage}>
            <Text style={styles.changeImageText}>Change photo</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.sectionHint}>One ingredient per line</Text>
        </View>
        <TextInput
          style={[styles.input, styles.multiline, styles.ingredientInput]}
          placeholder={'2 cups pasta\n1 cup mushrooms\n1/2 cup cream'}
          placeholderTextColor="#97A39A"
          multiline
          value={ingredients}
          onChangeText={setIngredients}
          textAlignVertical="top"
        />

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Cooking instructions</Text>
          <Text style={styles.sectionHint}>One step per line</Text>
        </View>
        <TextInput
          style={[styles.input, styles.multiline, styles.stepsInput]}
          placeholder={'Boil the pasta.\nCook the mushrooms.\nAdd cream and combine.'}
          placeholderTextColor="#97A39A"
          multiline
          value={steps}
          onChangeText={setSteps}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={save}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {editing ? 'Save Changes' : 'Save Recipe'}
          </Text>
          <Text style={styles.saveArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.bottomNote}>
          Made with love, shared with Foodie.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F1' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE8DD',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAF0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: GREEN, fontSize: 34, lineHeight: 37 },
  headerTitleBox: { marginLeft: 13 },
  headerTitle: { fontSize: 18, color: '#26352B', fontWeight: '800' },
  headerSubtitle: { fontSize: 12, color: '#85877D', marginTop: 3 },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 35 },
  intro: { marginBottom: 24 },
  eyebrow: { color: '#E66E46', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { fontSize: 27, color: '#26352B', fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#85877D', fontSize: 13, lineHeight: 20, marginTop: 7 },
  label: { color: '#465247', fontSize: 13, fontWeight: '700', marginBottom: 9 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE4D9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#26352B',
    marginBottom: 21,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D9B99F',
    borderStyle: 'dashed',
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#F7EFE5',
    minHeight: 165,
    marginBottom: 9,
  },
  uploadPlaceholder: {
    minHeight: 165,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#F3E4D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },
  uploadIconText: { color: GREEN, fontSize: 29, lineHeight: 32 },
  uploadTitle: { color: '#465247', fontWeight: '800', fontSize: 14 },
  uploadSubtitle: { color: '#85877D', fontSize: 12, marginTop: 6 },
  preview: { width: '100%', height: 200, resizeMode: 'cover' },
  changeImage: { alignSelf: 'flex-end', paddingVertical: 7, marginBottom: 17 },
  changeImageText: { color: GREEN, fontSize: 12, fontWeight: '700' },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 3,
    marginBottom: 9,
  },
  sectionTitle: { color: '#26352B', fontSize: 16, fontWeight: '800' },
  sectionHint: { color: '#85877D', fontSize: 10 },
  multiline: { minHeight: 120, lineHeight: 22 },
  ingredientInput: { height: 135 },
  stepsInput: { height: 160 },
  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: GREEN,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  saveArrow: { color: '#FFFFFF', fontSize: 21, marginLeft: 12 },
  bottomNote: { color: '#85877D', fontSize: 11, textAlign: 'center', marginTop: 17 },
});
