package com.smithyproductions.souschef;

import android.os.Bundle;
import android.preference.PreferenceActivity;

/**
 * Created by rory on 04/01/15.
 */
public class SettingsActivity extends PreferenceActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);
    }

}
