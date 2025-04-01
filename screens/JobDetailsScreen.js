import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Linking 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      if (storedJobs) {
        const jobsArray = JSON.parse(storedJobs);
        setIsBookmarked(
          jobsArray.some(j => j.title === job.title && j.company === job.company)
        );
      }
    } catch (error) {
      console.error('Error checking bookmark', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      let jobsArray = storedJobs ? JSON.parse(storedJobs) : [];
      
      if (isBookmarked) {
        jobsArray = jobsArray.filter(
          j => !(j.title === job.title && j.company === job.company)
        );
      } else {
        jobsArray.push(job);
      }
      
      await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(jobsArray));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark', error);
    }
  };

  const handleCall = () => {
    if (job.primary_details?.Phone) {
      Linking.openURL(`tel:${job.primary_details.Phone}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.companyLogoPlaceholder}>
          <Ionicons name="business" size={32} color="#2563eb" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="#64748b" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Place || 'Not specified'}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={20} color="#64748b" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Salary</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Salary || 'Not specified'}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={20} color="#64748b" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Experience || 'Not specified'}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={20} color="#64748b" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Qualification</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Qualification || 'Not specified'}</Text>
          </View>
        </View>
      </View>

      {job.primary_details?.Phone && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#2563eb" />
            <Text style={styles.contactText}>{job.primary_details.Phone}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.bookmarkButton, isBookmarked && styles.bookmarkedButton]}
          onPress={toggleBookmark}
        >
          <Ionicons 
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={20} 
            color={isBookmarked ? '#ffffff' : '#2563eb'} 
          />
          <Text style={[styles.buttonText, isBookmarked && styles.bookmarkedButtonText]}>
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  company: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    marginTop: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#2563eb',
    marginLeft: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  bookmarkButton: {
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  bookmarkedButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
  bookmarkedButtonText: {
    color: '#ffffff',
  },
});

export default JobDetailsScreen;