package graphedit.layout;

import graphedit.layout.adding.AddingLayouter;
import graphedit.layout.graph.CircleLayouter;
import graphedit.layout.graph.FRLayouter;
import graphedit.layout.graph.KKLayouter;
import graphedit.layout.graph.SpringLayouter;
import graphedit.layout.random.RandomLayouter;
import graphedit.layout.tree.TreeLayouter;
import graphedit.view.GraphEditView;

import java.awt.Graphics;

public class LayouterFactory {
	
	public static Layouter createLayouter(LayoutStrategy strategy, GraphEditView view, Graphics g){
		Layouter layouter = null;
		
		if (strategy == LayoutStrategy.ADDING)
			layouter = new AddingLayouter(view);
		else if (strategy == LayoutStrategy.RANDOM)
			layouter = new RandomLayouter(view);
		else if (strategy == LayoutStrategy.TREE)
			layouter = new TreeLayouter(view, g);
		else if (strategy == LayoutStrategy.KKGRAPH)
			layouter = new KKLayouter(view);
		else if (strategy == LayoutStrategy.SPRING)
			layouter = new SpringLayouter(view);
		else if (strategy == LayoutStrategy.FRGRAPH)
			layouter = new FRLayouter(view);
		else if (strategy == LayoutStrategy.CIRCLE)
			layouter = new CircleLayouter(view);
		
		return layouter;
	}

}
