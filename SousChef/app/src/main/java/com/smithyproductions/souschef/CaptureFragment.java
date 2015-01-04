package com.smithyproductions.souschef;

import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.google.zxing.Result;

import me.dm7.barcodescanner.zxing.ZXingScannerView;

/**
 * Created by rory on 04/01/15.
 */
public class CaptureFragment extends Fragment implements ZXingScannerView.ResultHandler {
    private static final String TAG = "MainActivity";
    private ZXingScannerView mScannerView;
    private MainActivityInterface mCallback;

    @Override
    public void onResume() {
        super.onResume();
        restartCamera();
    }

    @Override
    public void onPause() {
        super.onPause();
        mScannerView.stopCamera();           // Stop camera on pause
    }

    public void restartCamera(){
        mScannerView.setResultHandler(this);
        mScannerView.startCamera();
    }

    @Override
    public void handleResult(Result rawResult) {
        // Do something with the result here
        switch (rawResult.getBarcodeFormat()){
            case EAN_8:
            case EAN_13:
                mCallback.onEanCodeReceived(rawResult.getText());
                break;
            default:
                Toast.makeText(getActivity(), "Cannot read barcode", Toast.LENGTH_SHORT).show();
        }
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.capture_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mScannerView = (ZXingScannerView) view.findViewById(R.id.scannerView);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        if(getActivity() instanceof MainActivityInterface){
            mCallback = (MainActivityInterface) getActivity();
        }else{
            throw new IllegalStateException(getActivity().getLocalClassName()+" must implement MainActivityInterface");
        }

    }
}
