package com.smithyproductions.souschef;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.smithyproductions.souschef.model.ServerResponse;
import com.squareup.picasso.Picasso;

/**
 * Created by rory on 04/01/15.
 */
public class ResultFragment extends Fragment {

    private View mProgressBar;
    private ImageView mProductImage;
    private TextView mProductName;
    private ListView mIngredientsList;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.result_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mProgressBar = view.findViewById(R.id.progressBar);
        mProductImage = (ImageView) view.findViewById(R.id.productImage);
        mProductName = (TextView) view.findViewById(R.id.productName);
        mIngredientsList = (ListView) view.findViewById(R.id.ingredientsList);
    }

    public void onResult(ServerResponse response) {
        mProgressBar.setVisibility(View.GONE);

        if(response.errors.size() > 0){
            mProductName.setText(response.errors.get(0));
        }else{
            Picasso.with(getActivity())
                    .load(response.productImage)
                    .into(mProductImage);

            mProductName.setText(response.productName);

            ListAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_list_item_1, response.ingredients);

            mIngredientsList.setAdapter(adapter);
        }
    }
}
