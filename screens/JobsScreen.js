import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  Image,
  RefreshControl 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const JobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      setJobs(prev => page === 1 ? response.data.results : [...prev, ...response.data.results]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      setBookmarkedJobs(storedJobs ? JSON.parse(storedJobs) : []);
    } catch (error) {
      console.error('Error loading bookmarks', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
    loadBookmarks();
  }, [page]);

  const toggleBookmark = async (job) => {
    try {
      let updatedBookmarks;
      const isBookmarked = bookmarkedJobs.some(
        b => b.title === job.title && b.company === job.company
      );

      if (isBookmarked) {
        updatedBookmarks = bookmarkedJobs.filter(
          b => !(b.title === job.title && b.company === job.company)
        );
      } else {
        updatedBookmarks = [...bookmarkedJobs, job];
      }

      await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
      setBookmarkedJobs(updatedBookmarks);
    } catch (error) {
      console.error('Error toggling bookmark', error);
    }
  };

  const renderItem = ({ item }) => {
    const isBookmarked = bookmarkedJobs.some(
      b => b.title === item.title && b.company === item.company
    );

    return (
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
            style={styles.bookmarkButton}
            onPress={() => toggleBookmark(item)}
          >
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={20} 
              color={isBookmarked ? '#2563eb' : '#64748b'} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={50} color="#dc2626" />
          <Text style={styles.errorText}>Failed to load jobs</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setPage(1);
              fetchJobs();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          onEndReached={() => !loading && setPage(p => p + 1)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator size="large" color="#2563eb" />}
          ListEmptyComponent={!loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={50} color="#cbd5e1" />
              <Text style={styles.emptyText}>No jobs available</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
        />
      )}
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
  bookmarkButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 10,
  },
});

export default JobsScreen;