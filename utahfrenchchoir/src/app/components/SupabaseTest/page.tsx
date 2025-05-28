/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';

// Temporary test component to debug Supabase connection
const SupabaseDebugTest = () => {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setResults([]);
    
    try {
      addResult('🔍 Starting Supabase connection test...');
      
      // Test 1: Check environment variables
      addResult(`📋 Environment check:`);
      addResult(`   - SUPABASE_URL exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}`);
      addResult(`   - SUPABASE_KEY exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
      addResult(`   - URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
      addResult(`   - Key length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0}`);
      
      // Test 2: Try to create Supabase client
      addResult('🔧 Creating Supabase client...');
      
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing environment variables');
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      addResult('✅ Supabase client created successfully');
      
      // Test 3: Test basic API call
      addResult('🌐 Testing basic API call...');
      
      const { data, error } = await supabase
        .from('nonexistent_table')
        .select('*')
        .limit(1);
        
      addResult(`📊 API Response:`);
      addResult(`   - Data: ${JSON.stringify(data)}`);
      addResult(`   - Error: ${JSON.stringify(error, null, 2)}`);
      
      if (error) {
        // This is expected for a nonexistent table
        if (error.code === 'PGRST116') {
          addResult('✅ API connection working (table not found error is expected)');
        } else {
          addResult(`❌ Unexpected API error: ${error.message}`);
        }
      }
      
      // Test 4: List tables
      addResult('📋 Listing available tables...');
      
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      addResult(`📊 Tables Response:`);
      addResult(`   - Data: ${JSON.stringify(tables)}`);
      addResult(`   - Error: ${JSON.stringify(tablesError, null, 2)}`);
      
      if (tables && tables.length > 0) {
        addResult(`✅ Found ${tables.length} tables`);
        tables.forEach((table: any) => {
          addResult(`   - ${table.table_name}`);
        });
      }
      
      // Test 5: Check for choir_applications table specifically
      addResult('🎵 Checking for choir_applications table...');
      
      const { data: choirData, error: choirError } = await supabase
        .from('choir_applications')
        .select('id')
        .limit(1);
        
      addResult(`📊 Choir Applications Response:`);
      addResult(`   - Data: ${JSON.stringify(choirData)}`);
      addResult(`   - Error: ${JSON.stringify(choirError, null, 2)}`);
      
      if (choirError) {
        if (choirError.code === 'PGRST116' || choirError.code === '42P01') {
          addResult('❌ choir_applications table does not exist - please create it!');
        } else {
          addResult(`❌ Error accessing choir_applications: ${choirError.message}`);
        }
      } else {
        addResult('✅ choir_applications table exists and is accessible');
      }
      
    } catch (error: any) {
      addResult(`❌ Critical error: ${error.message}`);
      addResult(`❌ Error stack: ${error.stack}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Supabase Connection Debug Test
        </h1>
        
        <button
          onClick={testConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-6"
        >
          🧪 Run Connection Test
        </button>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-gray-500">Click Run Connection Test to start debugging...</div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>This test will help identify exactly where the Supabase connection is failing.</p>
          <p>Share the output from this test to get specific help with your setup.</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebugTest;