import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  Text, 
  View, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  RefreshControl 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookmarksScreen = ({ navigation }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookmarkedJobs = async () => {
    setRefreshing(true);
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      setBookmarkedJobs(storedJobs ? JSON.parse(storedJobs) : []);
    } catch (error) {
      console.error('Error loading bookmarked jobs', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarkedJobs();
    }, [])
  );

  const removeBookmark = async (job) => {
    try {
      const updatedJobs = bookmarkedJobs.filter(
        j => !(j.title === job.title && j.company === job.company)
      );
      await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(updatedJobs));
      setBookmarkedJobs(updatedJobs);
    } catch (error) {
      console.error('Error removing bookmark', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyLogoPlaceholder}>
          <Ionicons name="business" size={24} color="#2563eb" />
        </View>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{item.primary_details?.Place || 'Not specified'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{item.primary_details?.Salary || 'Not specified'}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('JobDetails', { job: item })}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeBookmark(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedJobs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchBookmarkedJobs}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={50} color="#cbd5e1" />
            <Text style={styles.emptyText}>No bookmarked jobs yet</Text>
            <Text style={styles.emptySubText}>Save jobs to view them here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  companyName: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  jobDetails: {
    marginVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#475569',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  removeButtonText: {
    color: '#dc2626',
    marginLeft: 5,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 5,
  },
});

export default BookmarksScreen;