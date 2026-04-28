// Test script for Supabase integration
// Run with: node database/test-integration.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase credentials
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('name').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function testTables() {
  console.log('\n📊 Testing Tables...');
  
  const tables = ['categories', 'profiles', 'stores', 'products', 'orders'];
  let allGood = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message);
        allGood = false;
      } else {
        console.log(`✅ Table '${table}' accessible`);
      }
    } catch (err) {
      console.error(`❌ Table '${table}' failed:`, err.message);
      allGood = false;
    }
  }
  
  return allGood;
}

async function testRealtime() {
  console.log('\n🔄 Testing Real-time...');
  
  try {
    const channel = supabase
      .channel('test-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'categories' 
        }, 
        (payload) => {
          console.log('📡 Real-time event received:', payload.eventType);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription successful');
          setTimeout(() => {
            channel.unsubscribe();
            console.log('🔌 Unsubscribed');
          }, 2000);
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Real-time subscription failed');
        }
      });
    
    return true;
  } catch (err) {
    console.error('❌ Real-time test error:', err.message);
    return false;
  }
}

async function testStorage() {
  console.log('\n📁 Testing Storage...');
  
  try {
    // Test if storage buckets exist
    const buckets = ['avatars', 'products', 'stores'];
    let allGood = true;
    
    for (const bucket of buckets) {
      const { data, error } = await supabase.storage.getBucket(bucket);
      
      if (error) {
        console.warn(`⚠️ Bucket '${bucket}' not found or inaccessible:`, error.message);
        console.log(`💡 Create bucket '${bucket}' in Supabase Storage`);
        allGood = false;
      } else {
        console.log(`✅ Bucket '${bucket}' accessible`);
      }
    }
    
    return allGood;
  } catch (err) {
    console.error('❌ Storage test error:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Burger3000 Supabase Integration Test\n');
  
  if (supabaseUrl === 'https://your-project-id.supabase.co' || 
      supabaseKey === 'your-anon-key-here') {
    console.error('❌ Please update supabaseUrl and supabaseKey in this script');
    process.exit(1);
  }
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('\n❌ Basic connection failed. Check your credentials.');
    process.exit(1);
  }
  
  const tablesOk = await testTables();
  const realtimeOk = await testRealtime();
  const storageOk = await testStorage();
  
  console.log('\n📋 Test Summary:');
  console.log(`Connection: ${connectionOk ? '✅' : '❌'}`);
  console.log(`Tables: ${tablesOk ? '✅' : '❌'}`);
  console.log(`Real-time: ${realtimeOk ? '✅' : '❌'}`);
  console.log(`Storage: ${storageOk ? '✅' : '❌'}`);
  
  if (connectionOk && tablesOk && realtimeOk) {
    console.log('\n🎉 Integration test passed! Your app is ready to use Supabase.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
}

// Run the tests
runTests().catch(console.error);
