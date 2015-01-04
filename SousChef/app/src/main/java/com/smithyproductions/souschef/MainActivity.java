package com.smithyproductions.souschef;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.google.gson.Gson;
import com.smithyproductions.souschef.model.ServerResponse;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.IOException;


public class MainActivity extends ActionBarActivity implements MainActivityInterface {
    private static final String TAG = "MainActivity";
    private ResultFragment resultFragment;
    private CaptureFragment captureFragment;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

        captureFragment = new CaptureFragment();
        fragmentTransaction.add(R.id.fragment_container, captureFragment);
        fragmentTransaction.commit();

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            startActivity(new Intent(this, SettingsActivity.class));
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onEanCodeReceived(String eanCode) {

        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

        resultFragment = new ResultFragment();
        fragmentTransaction.add(R.id.fragment_container, resultFragment);
        fragmentTransaction.commit();

        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        String serverIp = sharedPref.getString("pref_key_server_ip", null);

        if (serverIp == null) {
            Toast.makeText(this, "Please set the server ip in settings", Toast.LENGTH_LONG).show();
        } else {

            final String url = "http://" + serverIp + ":3110?ean="+eanCode;

            final OkHttpClient client = new OkHttpClient();

            new Thread(new Runnable() {
                @Override
                public void run() {


                    Log.d(TAG,"attempting to contact "+url);

                    Request request = new Request.Builder()
                            .url(url)
                            .build();

                    try {
                        Response response = client.newCall(request).execute();

                        Gson gson = new Gson();

                        String text = response.body().string();

                        Log.d(TAG,"received: "+text);

                        final ServerResponse obj = gson.fromJson(text, ServerResponse.class);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if(resultFragment != null){
                                    resultFragment.onResult(obj);
                                }
                            }
                        });


                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }
            }).start();


        }
    }

    @Override
    public void onBackPressed() {
        if (resultFragment != null) {
            removeResultFragment();
        } else {
            super.onBackPressed();
        }
    }

    private void removeResultFragment() {
        FragmentManager manager = getFragmentManager();
        FragmentTransaction trans = manager.beginTransaction();
        trans.remove(resultFragment);
        trans.commit();
        manager.popBackStack();
        resultFragment = null;

        captureFragment.restartCamera();
    }
}
